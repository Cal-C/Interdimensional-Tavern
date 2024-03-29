"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cards = void 0;
const Cards = exports.Cards = [{
  id: "G1",
  name: "Nut Tap",
  description: "Taps the chosen opponent in the nuts, dealing 2 damage to health.",
  playType: "SingleTargetAttack",
  //type is an external reference to the type of card, it can be used to see what other cards can interact with it
  whenPlayable: ["Action"],
  //whenPlayable is an array of strings that represent the phases in which the card can be played, it will usually just be one thing
  healthEffect: -2
}, {
  id: "G2",
  name: "Get Iced",
  description: "Surprises the chosen opponent with a Smirnoff Ice, dealing 1 damage to health and 2 drunkenness.",
  //in the image he is hitting another player with the bottle
  playType: "SingleTargetAttack",
  whenPlayable: ["Action"],
  drunkennessEffect: 2,
  healthEffect: -1
}, {
  id: "G3",
  name: "Rally and Rage",
  description: "Responds to an attack with a counterattack, dealing 1 damage to health.",
  playType: "SingleTargetAttack",
  whenPlayable: ["AfterAttacked"],
  healthEffect: -1
}, {
  id: "G4",
  name: "Witch's Hangover Cure",
  description: "Gorath can pay 1 cash to remove 1 drunkenness.",
  playType: "Heal",
  whenPlayable: ["Whenever"],
  cashCost: -1,
  //this is a cost since it always affects the player of the card, not the target
  drunkennessEffect: -1
}];