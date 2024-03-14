export const Cards = [
    {
        id : "G1",
        name : "Nut Tap",
        description : "Taps the chosen opponent in the nuts, dealing 2 damage to health.",
        playType : "SingleTargetAttack", //type is an internal identifier for the card, used to determine what code to run when the card is played
        whenPlayable : ["Action"], //whenPlayable is an array of strings that represent the phases in which the card can be played
        heathEffect : -2,
    },
    {
        id: "G2",
        name : "Get Iced",
        description : "Engages a chosen opponent in an ancient tradition of hiding a Smirnoff Ice and forcing them to drink it, dealing 2 damage to drunkenness.",
        playType : "SingleTargetAttack", 
        whenPlayable : ["Action"],
        drunkennessEffect : 2,
    },
    {
        id: "G3",
        name : "Rally and Rage",
        description : "Responds to an attack with a counterattack, dealing 1 damage to health.",
        playType : "SingleTargetAttack",
        whenPlayable : ["AfterAttacked"],
        heathEffect : -1,
    },
    {
        id: "G4",
        name : "Witch's Hangover Cure",
        description : "Gorath can pay 1 cash to remove 1 drunkenness whenever.",
        playType : "Heal",
        whenPlayable : ["Any"],
        cashEffect : -1,
        drunkennessEffect : -1,
    }
]