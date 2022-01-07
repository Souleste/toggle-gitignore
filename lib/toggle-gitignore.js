'use babel';

DOMTokenList.prototype.toArray =
NodeList.prototype.toArray =
HTMLCollection.prototype.toArray = function() {
    return Array.prototype.slice.call(this);
}

import ToggleGitignoreView from './toggle-gitignore-view';
import { CompositeDisposable } from 'atom';

import * as childProcess from 'child_process';

export default {

    toggleGitignoreView: null,
    subscriptions: null,
    packagePath: atom.configDirPath+'\\packages\\toggle-gitignore',
    platform: require('os').platform(),

    activate(state) {
        this.toggleGitignoreView = new ToggleGitignoreView(state.toggleGitignoreViewState);

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'toggle-gitignore:tree-view-toggle': (e) => this.treeViewToggle(e)
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'toggle-gitignore:tab-toggle': (e) => this.tabToggle(e)
        }));
    },

    treeViewToggle(e) {
        e.preventDefault();
        console.log('Getting selected items from tree-view context menu!');

        var dirs = document.querySelectorAll('[is="tree-view-directory"].selected').toArray();
        var files = document.querySelectorAll('[is="tree-view-file"].selected').toArray().filter((file) => !file.closest('[is="tree-view-directory"]').matches('.selected'));
        var paths = dirs.concat(files).map((item) => item.querySelector('.name').dataset.path.trim()).join(' ').trim();

        this.toggle(paths);
    },

    tabToggle(e) {
        e.preventDefault();
        console.log('Getting selected items from tab context menu!');

        var path = document.querySelector('[is="tabs-tab"].right-clicked .title').dataset.path;
        this.toggle(path);
    },

    toggle(paths) {
        console.log('Toggling selected items from .gitignore!');

        var repo = atom.project.getRepositories()[0];
        if (repo) {
            var command;
            var cliPath = this.packagePath+'\\cli';
            switch(this.platform) {
                case 'win32':
                    cliPath += '\\win32';
                    command = cliPath+'\\toggle-gitignore.cmd '+cliPath+'\\toggle-gitignore ';
                    break;
            }

            if (command) {
                command += paths;
                childProcess.exec(command, (err, stdout, stderr) => {
                    if (err) console.log(err);
                    else console.log(stdout, stderr, '\nFinished toggling selected items from .gitignore!');
                });
            }
        } else {
            atom.notifications.addError('Not a Git Repository', {
                dismissable: true,
                description: 'One or more of the selected items are not a git repository (or any of the parent directories).'
            });
        }
    }

};
