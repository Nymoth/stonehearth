var set = {

aux: {

	moneda: {
		nombre: 'Moneda',
		desc: 'Obtienes 1 cristal de maná solo para este turno.',
		cost: 0,
		type: 'spell',
		eff: function() {
			manaPool(1, 'me', 'temp');
		}
	}

},

comun: {

		fuego_fatuo: {
			nombre: 'Fuego fatuo',
			cost: 0,
			type: 'creature',
			att: 1,
			def: 1,
			rarity: 'common'
		},

		cangrejo_hambriento: {
			nombre: 'Cangrejo hambriento',
			desc: '<b>Grito de batalla:</b> Destruye a un múrloc y obtiene +2/+2.',
			cost: 1,
			type: 'creature',
			race: 'beast',
			grito_batalla: function() {
				var esto = this;
				destroy('mine', 'creature', 'murloc', function() {
					esto.att += 2;
					esto.def += 2;
				});
			},
			att: 1,
			def: 2,
			rarity: 'epic'
		},

		arquera_elfa: {
			nombre: 'Arquera elfa',
			desc: '<b>Grito de batalla:</b> Inflige 1 p. de daño.',
			cost: 1,
			type: 'creature',
			att: 1,
			def: 1,
			grito_batalla: function() {
				dmg(1, 'any');
			},
			rarity: 'basic'
		},

		asaltante_murloc: {
			nombre: 'Asaltante múrloc',
			cost: 1,
			type: 'creature',
			race: 'murloc',
			att: 2,
			def: 1,
			rarity: 'basic',
		},

		celadora_de_la_luz: {
			nombre: 'Celadora de la luz',
			cost: 1,
			type: 'creature',
			eff: function() {
				var esto = this;
				game.addEventListener('onHeal', function() {
					esto.att += 2;
				});
			},
			att: 1,
			def: 2,
			rarity: 'rare'
		},

		clamamareas_murloc: {
			nombre: 'Clamameras múrloc',
			cost: 1,
			type: 'creature',
			race: 'murloc',
			eff: function() {
				var esto = this;
				game.addEventListener('onSummonCreatureMurloc', function() {
					esto.att++;
				});
			},
			att: 1,
			def: 1,
			rarity: 'rare'
		},

		corsario_velasangre: {
			nombre: 'Corsario velasangre',
			cost: 1,
			type: 'creature',
			race: 'pirate',
			grito_batalla: function() {
				weaponDur(-1, 'enemy');
			},
			att: 1,
			def: 2,
			rarity: 'rare'
		},

		dracohalcon_joven: {
			nombre: 'Dracohalcón joven',
			cost: 1,
			type: 'creature',
			race: 'beast',
			viento_furioso: true,
			att: 1,
			def: 1,
			rarity: 'common'
		},

		escudera_argenta: {
			nombre: 'Escudera argenta',
			desc: '<b>Escudo divino</b>',
			cost: 1,
			type: 'creature',
			escudo_divino: true,
			att: 1,
			def: 1,
			rarity: 'common'
		},

		gnomo_paria: {
			nombre: 'Gnomo paria',
			cost: 1,
			type: 'creature',
			ultimo_aliento: function() {
				dmg(2, 'enemyHero');
			},
			att: 2,
			def: 1,
			rarity: 'common'
		}

	},
/*
druida: {

		estimular: {
			cost: 0,
			type: spell,
			eff: mana:+2*1t
		},

		fuego_lunar: {
			cost: 0,
			type: spell,
			eff: lf:-1
		}

		

	},

cazador: [


	]

mago: [

	
	]

paladin: [


	]

sacerdote: [


	]

picaro: [


	]

chaman: [


	]

brujo: [


	]

guerrero: [


	]
*/
}
