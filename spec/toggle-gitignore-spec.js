'use babel';

import ToggleGitignore from '../lib/toggle-gitignore';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('ToggleGitignore', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('toggle-gitignore');
  });

  describe('when the toggle-gitignore:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.toggle-gitignore')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'toggle-gitignore:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.toggle-gitignore')).toExist();

        let toggleGitignoreElement = workspaceElement.querySelector('.toggle-gitignore');
        expect(toggleGitignoreElement).toExist();

        let toggleGitignorePanel = atom.workspace.panelForItem(toggleGitignoreElement);
        expect(toggleGitignorePanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'toggle-gitignore:toggle');
        expect(toggleGitignorePanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.toggle-gitignore')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'toggle-gitignore:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let toggleGitignoreElement = workspaceElement.querySelector('.toggle-gitignore');
        expect(toggleGitignoreElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'toggle-gitignore:toggle');
        expect(toggleGitignoreElement).not.toBeVisible();
      });
    });
  });
});
