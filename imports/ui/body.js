import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import { ReactiveDict } from 'meteor/reactive-dict';

import './body.html';
import './body.js';



Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {

    // cache les taches terminé // filtrage
    return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Afficher les dernières tâches en haut //   // Sinon, retourner toutes les tâches
    return Tasks.find({}, { sort: { createdAt: -1 } } );
  },
  //affiche un nombre de tache imcomplete
  incompleteCount() { //Compteur de tache
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent formulaire de navigateur par défaut soumettre
    event.preventDefault();

    // Obtenir la valeur de l'élément de form
    const target = event.target;
    const text = target.text.value;

    // Insérer une tâche dans la collection
    Tasks.insert({
      text,
      createdAt: new Date(), // heure
    });

    // // Form clear
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});

Template.task.events({
  'click .toggle-checked'() {
      // Définissez la propriété vérifiée à l'opposé de sa valeur actuelle
    Tasks.update(this._id, {
      $set: { checked: ! this.checked },
    });
  },
  'click .delete'() {
    Tasks.remove(this._id);
  },
});
