# test-typo3

This repository is just for automated testing of DDEV.

- Clone this repo, which was created with the TYPO3 v13
- `ddev config --auto`
- To update the repo: `ddev composer update --with-all-dependencies`- `git add -u` and `git add *`
- Load the database and see if things are working.
- Log in and edit the page "testpage" (Congratulations->testpage) to make sure the content has "This is test text for TestDdevFullSiteSetup".
- `pushd public/fileadmin && ln -sf README.txt test.txt && popd`
- `ddev export-db --file=.tarballs/db.sql --gzip=false`
- `tar -czf .tarballs/db.sql.tar.gz -C .tarballs db.sql`
- `tar -czf .tarballs/files.tgz -C public/fileadmin/ .`
- Run `git push`, create a new release adding `.tarballs/db.sql.tar.gz` and `.tarballs/files.tgz` as assets
- Update the URLs in `ddev/ddev` ddevapp_test.go for the new release
- Rerun the tests for TYPO3 with `GOTEST_SHORT=5 make testpkg TESTARGS="-run TestDdevFullSiteSetup"`

