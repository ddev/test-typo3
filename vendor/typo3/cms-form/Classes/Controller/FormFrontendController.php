<?php

declare(strict_types=1);

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

namespace TYPO3\CMS\Form\Controller;

use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Core\Configuration\FlexForm\FlexFormTools;
use TYPO3\CMS\Core\Service\FlexFormService;
use TYPO3\CMS\Core\Utility\ArrayUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface as ExtbaseConfigurationManagerInterface;
use TYPO3\CMS\Extbase\Http\ForwardResponse;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Form\Domain\Configuration\ArrayProcessing\ArrayProcessing;
use TYPO3\CMS\Form\Domain\Configuration\ArrayProcessing\ArrayProcessor;
use TYPO3\CMS\Form\Domain\Configuration\ConfigurationService;
use TYPO3\CMS\Form\Domain\Configuration\FormDefinition\Converters\FinisherOptionsFlexFormOverridesConverter;
use TYPO3\CMS\Form\Domain\Configuration\FormDefinition\Converters\FlexFormFinisherOverridesConverterDto;
use TYPO3\CMS\Form\Mvc\Configuration\ConfigurationManagerInterface as ExtFormConfigurationManagerInterface;
use TYPO3\CMS\Form\Mvc\Persistence\FormPersistenceManagerInterface;

/**
 * The frontend controller
 *
 * Scope: frontend
 * @internal
 */
class FormFrontendController extends ActionController
{
    public function __construct(
        protected readonly ConfigurationService $configurationService,
        protected readonly FormPersistenceManagerInterface $formPersistenceManager,
        protected readonly FlexFormService $flexFormService,
        protected readonly FlexFormTools $flexFormTools,
        protected readonly ExtFormConfigurationManagerInterface $extFormConfigurationManager,
    ) {}

    /**
     * Take the form which should be rendered from the plugin settings
     * and overlay the formDefinition with additional data from
     * flexform and typoscript settings.
     * This method is used directly to display the first page from the
     * formDefinition because its cached.
     *
     * @internal
     */
    public function renderAction(): ResponseInterface
    {
        $formDefinition = [];
        if (!empty($this->settings['persistenceIdentifier'])) {
            $typoScriptSettings = $this->configurationManager->getConfiguration(ExtbaseConfigurationManagerInterface::CONFIGURATION_TYPE_SETTINGS, 'form');
            $formSettings = $this->extFormConfigurationManager->getYamlConfiguration($typoScriptSettings, true);
            $formDefinition = $this->formPersistenceManager->load($this->settings['persistenceIdentifier'], $formSettings, $typoScriptSettings);
            $formDefinition['persistenceIdentifier'] = $this->settings['persistenceIdentifier'];
            $formDefinition = $this->overrideByFlexFormSettings($formDefinition);
            $formDefinition = ArrayUtility::setValueByPath($formDefinition, 'renderingOptions._originalIdentifier', $formDefinition['identifier'], '.');
            $formDefinition['identifier'] .= '-' . ($this->request->getAttribute('currentContentObject')?->data['uid'] ?? '');
        }
        $this->view->assign('formConfiguration', $formDefinition);
        return $this->htmlResponse();
    }

    /**
     * This method is used to display all pages / finishers except the
     * first page because its non cached.
     *
     * @internal
     */
    public function performAction(): ResponseInterface
    {
        return new ForwardResponse('render');
    }

    /**
     * Override the formDefinition with additional data from the Flexform
     * settings. For now, only finisher settings are overridable.
     */
    protected function overrideByFlexFormSettings(array $formDefinition): array
    {
        $flexFormData = $this->request->getAttribute('currentContentObject')?->data['pi_flexform'] ?? [];
        if (is_string($flexFormData) && $flexFormData !== '') {
            $flexFormData = GeneralUtility::xml2array($flexFormData);
        }
        if (!is_array($flexFormData) || $flexFormData === []) {
            return $formDefinition;
        }
        if (isset($formDefinition['finishers'])) {
            $prototypeName = $formDefinition['prototypeName'] ?? 'standard';
            $prototypeConfiguration = $this->configurationService->getPrototypeConfiguration($prototypeName);
            foreach ($formDefinition['finishers'] as $index => $formFinisherDefinition) {
                $finisherIdentifier = $formFinisherDefinition['identifier'];
                $sheetIdentifier = $this->getFlexformSheetIdentifier($formDefinition, $prototypeName, $finisherIdentifier);
                $flexFormSheetSettings = $this->getFlexFormSettingsFromSheet($flexFormData, $sheetIdentifier);
                if (($this->settings['overrideFinishers'] ?? false) && isset($flexFormSheetSettings['finishers'][$finisherIdentifier])) {
                    $prototypeFinisherDefinition = $prototypeConfiguration['finishersDefinition'][$finisherIdentifier] ?? [];
                    $converterDto = GeneralUtility::makeInstance(
                        FlexFormFinisherOverridesConverterDto::class,
                        $prototypeFinisherDefinition,
                        $formFinisherDefinition,
                        $finisherIdentifier,
                        $flexFormSheetSettings
                    );
                    // Iterate over all `prototypes.<prototypeName>.finishersDefinition.<finisherIdentifier>.FormEngine.elements` values
                    GeneralUtility::makeInstance(ArrayProcessor::class, $prototypeFinisherDefinition['FormEngine']['elements'])->forEach(
                        GeneralUtility::makeInstance(
                            ArrayProcessing::class,
                            'modifyFinisherOptionsFromFlexFormOverrides',
                            '^(.*)(?:\.config\.type|\.section)$',
                            GeneralUtility::makeInstance(FinisherOptionsFlexFormOverridesConverter::class, $converterDto)
                        )
                    );
                    $formDefinition['finishers'][$index] = $converterDto->getFinisherDefinition();
                }
            }
        }
        return $formDefinition;
    }

    protected function getFlexformSheetIdentifier(array $formDefinition, string $prototypeName, string $finisherIdentifier): string
    {
        return md5(
            implode('', [
                $formDefinition['persistenceIdentifier'],
                $prototypeName,
                $formDefinition['identifier'],
                $finisherIdentifier,
            ])
        );
    }

    protected function getFlexFormSettingsFromSheet(array $flexForm, string $sheetIdentifier): array
    {
        $sheetData = [];
        $sheetData['data'] = array_filter(
            $flexForm['data'] ?? [],
            static function ($key) use ($sheetIdentifier) {
                return $key === $sheetIdentifier;
            },
            ARRAY_FILTER_USE_KEY
        );
        if (empty($sheetData['data'])) {
            return [];
        }
        $sheetDataXml = $this->flexFormTools->flexArray2Xml($sheetData);
        return $this->flexFormService->convertFlexFormContentToArray($sheetDataXml)['settings'] ?? [];
    }
}