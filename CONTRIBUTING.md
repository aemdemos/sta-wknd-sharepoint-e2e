# How to Contribute

To contribute to this project, please follow these steps:

1. **Run the backup and reset e2e workflow**
   - Navigate to the Actions tab in the GitHub repository
   - Find and run the "Backup and Reset to E2E Workflow"
   - This will create a backup branch and reset the main branch to the E2E commit

2. **Pull the latest changes to your branch**
   ```bash
   git pull origin main
   ```

3. **Create a Pull Request**
   - Make your changes on a feature branch
   - Push your changes to the repository
   - Create a Pull Request targeting the main branch

4. **Update the E2E workflow commit hash**
   - Once your PR is merged into main, copy the commit hash of the merge commit
   - Navigate to the repository Settings → Secrets and variables → Actions
   - Navigate to the "Variables" tab
   - Update the Github repository variable `E2E_WORKFLOW_COMMIT` with the new commit hash

This process ensures that the E2E workflow always resets to a known good state for testing purposes.

## Additional Guidelines

In your pull request, outline:

* What the changes intend
* How they change the existing code
* If (and what) they breaks
* Start the pull request with the GitHub issue ID, e.g. #123

Lastly, please follow the [pull request template](.github/pull_request_template.md) when submitting a pull request!

Each commit message that is not part of a pull request:

* Should contain the issue ID like `#123`
* Can contain the tag `[trivial]` for trivial changes that don't relate to an issue
