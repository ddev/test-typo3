.. include:: /Includes.rst.txt

..  _adding-buttons:

=======================
Adding button to Widget
=======================

.. php:namespace:: TYPO3\CMS\Dashboard\Widgets

In order to add a button to a widget, a new dependency to an :php:`ButtonProviderInterface` can be added.

..  _adding-buttons-template:

Template
--------

The output itself is done inside of the Fluid template, for example :file:`Resources/Private/Templates/Widget/RssWidget.html`:

.. code-block:: html

   <f:if condition="{button}">
      <a href="{button.link}" target="{button.target}" class="widget-cta">
         {f:translate(id: button.title, default: button.title)}
      </a>
   </f:if>

..  _adding-buttons-configuration:

Configuration
-------------

The configuration is done through an configured Instance of the dependency, for example :file:`Services.yaml`:

.. code-block:: yaml

   services:
     # …

     dashboard.buttons.t3news:
       class: 'TYPO3\CMS\Dashboard\Widgets\Provider\ButtonProvider'
       arguments:
         $title: 'LLL:EXT:dashboard/Resources/Private/Language/locallang.xlf:widgets.t3news.moreItems'
         $link: 'https://typo3.org/project/news'
         $target: '_blank'

     dashboard.widget.t3news:
       class: 'TYPO3\CMS\Dashboard\Widgets\RssWidget'
       arguments:
         # …
         $buttonProvider: '@dashboard.buttons.t3news'
         # …

See also: :php:`\TYPO3\CMS\Dashboard\Widgets\Provider\ButtonProvider`.

..  confval:: $title
    :type: string
    :name: button-title

    The title used for the button. E.g. an ``LLL:EXT:`` reference like
    ``LLL:EXT:dashboard/Resources/Private/Language/locallang.xlf:widgets.t3news.moreItems``.

..  confval:: $link
    :type: string
    :name: button-link

    The link to use for the button. Clicking the button will open the link.

..  confval:: $target
    :type: string
    :name: button-target

    The target of the link, e.g. ``_blank``.
    ``LLL:EXT:dashboard/Resources/Private/Language/locallang.xlf:widgets.t3news.moreItems``.


..  _adding-buttons-implementation:

Implementation
--------------

An example implementation could look like this:

..  code-block:: php
    :caption: Classes/Widgets/RssWidget.php

    class RssWidget implements WidgetInterface
    {
        public function __construct(
            // …
            private readonly ButtonProviderInterface $buttonProvider = null,
            // …
        ) {
        }

        public function renderWidgetContent(): string
        {
            // …
            $this->view->assignMultiple([
                // …
                'button' => $this->buttonProvider,
                // …
            ]);
            // …
        }

        public function getOptions(): array
        {
            return $this->options;
        }
    }
