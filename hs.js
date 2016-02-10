// UTF-8 with BOM
// eventos ---------------------------------------------------------
var evt_descartesRdy = new CustomEvent('onDescartesRdy', {detail: {count: 1}}); // ToDo: IA no se descarta

var evt_inicioTurno = new CustomEvent('onInicioTurno', {detail: {jugador: null}});
var evt_finTurno = new CustomEvent('onFinTurno', {detail: {jugador: null}});

var evt_jugarCarta = new CustomEvent('onJugarCarta', {detail: {}});

var evt_objetivoElejido = new CustomEvent('onObjetivoElejido', {detail: {}});
// funciones -------------------------------------------------------
function dmg(dmg, cx, subtype, callback) {
	console.log(dmg + ' daño a ' + cx + ', subtipo: ' + subtype + ', callback: ' + callback);
	switch(cx) {
		case 'any':

			break;
		case 'all':

			break;
		case 'enemy':

			break;
		case 'allEnemy':

			break;
		case 'enemyPlayer':

			break;
		case 'enemyCreature':
			switch(subtype) {
				case 'murloc':

					break;
				case 'beast':

					break;
				case 'pirate':

					break;
				default:

					break;
			}
			break;
		case 'allEnemyCreatures':
			switch(subtype) {
				case 'murloc':

					break;
				case 'beast':

					break;
				case 'pirate':

					break;
				default:

					break;
			}
			break;
		case 'mine':

			break;
		case 'allMine':

			break;
		case 'myself':
			evt_inicioTurno.detail.jugador.set('vida', evt_inicioTurno.detail.jugador.get('vida') - dmg);
			setStatus(evt_inicioTurno.detail.jugador);
			break;
		case 'myCreature':
			switch(subtype) {
				case 'murloc':

					break;
				case 'beast':

					break;
				case 'pirate':

					break;
				default:

					break;
			}
			break;
		case 'allMyCreatures':
			switch(subtype) {
				case 'murloc':

					break;
				case 'beast':

					break;
				case 'pirate':

					break;
				default:

					break;
			}
			break;
	}
	if (callback) {
		callback();
	}
}
function destroy(cx, type, subtype, callback) {

}
function weaponDur(dur, cx, callback) {

}
function manaPool(cuant, cx, temp) {
console.log('FUNC ** manaPool(', cuant, cx, temp, ')');
	switch (cx) {
		case 'me':
//console.log('CONTROL ** manaPool on me (', evt_inicioTurno.detail.jugador.get('nombre'), ')', cuant, 'mana (', temp, ')');
//console.log('Antes', evt_inicioTurno.detail.jugador.get('manaActual'));
			evt_inicioTurno.detail.jugador.set('manaActual', evt_inicioTurno.detail.jugador.get('manaActual') + cuant);
			if (temp === 'perm') {
				evt_inicioTurno.detail.jugador.set('manaTotal', evt_inicioTurno.detail.jugador.get('manaTotal') + cuant);
			}
//console.log('Despues', evt_inicioTurno.detail.jugador.get('manaActual'));
			setStatus(evt_inicioTurno.detail.jugador);
			break;
		case 'enemy':
//console.log('CONTROL ** manaPool on enemy (', j[ind].get('nombre'), ')');
			var ind = (evt_inicioTurno.detail.jugador.get('ind') === 0 ? 1 : 0);
			j[ind].set('manaActual', j[ind].get('manaActual') + cuant);
			if (temp === 'perm') {
				j[ind].set('manaTotal', j[ind].get('manaTotal') + cuant);
			}
			setStatus(j[ind]);
			break;
		case 'all':
//console.log('CONTROL ** manaPool on all');
			j[0].set('manaActual', j[0].get('manaActual') + cuant);
			j[1].set('manaActual', j[1].get('manaActual') + cuant);
			if (temp === 'perm') {
				j[0].set('manaTotal', j[0].get('manaTotal') + cuant);
				j[1].set('manaTotal', j[1].get('manaTotal') + cuant);
			}
			setStatus(j[0]);
			setStatus(j[1]);
			break;
	}
}
function robarCarta(jugador) {
console.log('FUNC ** robarCarta(', jugador.get('nombre'), ')');
	var mazo = jugador.get('mazo');
	// Si no tiene cartas en el mazo le hace daño
	if (mazo.cartas.length > 0) {
		var carta = mazo.cartas.shift();
		cartaAMano(jugador, carta);
		jugador.set('mazo', mazo);
		return carta;
	} else {
		var _danoRobar = jugador.get('danoRobar');
		_danoRobar++;
		jugador.set('danoRobar', _danoRobar);
		dmg(_danoRobar, 'myself');
console.log('FLOW ** (robarCarta) Quiso robar una carta pero no le quedaban el mazo. Recibe', _danoRobar, 'de daño');
	}
}
function cartaAMano(jugador, carta) {
console.log('FUNC ** cartaAMano(', jugador.get('nombre'), carta, ')');
	var mano = jugador.get('mano');
	// Si tiene 10 cartas en la mano se le descarta
	if (mano.length < 10) {
		mano.push(carta);
		jugador.set('mano', mano);
		renderCartaMano(jugador, carta);
	} else {
console.log('FLOW ** (cartaAMano) Quiso poner una carta en la mano pero ya tenía 10 cartas');
	}
	return carta;
}
function descartes(jugador, indicesCartas) {
console.log('FUNC ** descartes(', jugador.get('nombre'), indicesCartas, ')');
	if (indicesCartas.length > 0) {
		var mano = jugador.get('mano');
		var mazo = jugador.get('mazo');
		// Primero descarto, luego robo.
		for (var i = indicesCartas.length - 1; i >= 0; i--) {
			mazo.cartas.push(mano.splice(indicesCartas[i], 1)[0]);
			if (jugador.get('ind') === 0) {
				var _domCarta = mesa.getElementsByClassName('campo')[getCampo(jugador)].getElementsByClassName('mano')[0].getElementsByClassName('carta')[indicesCartas[i]];
				mesa.getElementsByClassName('campo')[getCampo(jugador)].getElementsByClassName('mano')[0].removeChild(_domCarta);
console.log('RENDER ** Quito de la mano', _domCarta);
			}
		}
		shuffle(mazo.cartas);
		jugador.set('mano', mano);
		jugador.set('mazo', mazo);
		for (var i = 0; i < indicesCartas.length; i++) {
			robarCarta(jugador);
		}
	}
	mesa.dispatchEvent(evt_descartesRdy);
}
function turno(jugador, ind) {
console.log('FUNC ** turno(', jugador[ind].get('nombre'), ')');
	startup(jugador[ind]);
	mesa.dispatchEvent(evt_inicioTurno);

	if (ind === 1) {
		// IA
		turnoIA(jugador[ind]);
		finTurno(jugador, ind);
	}
}
function startup(jugador) {
console.log('FUNC ** startup(', jugador.get('nombre'), ')');
	evt_inicioTurno.detail.jugador = jugador;
	robarCarta(jugador);
	if (jugador.get('manaTotal') < 10) {
		jugador.set('manaTotal', jugador.get('manaTotal') + 1);
		jugador.set('manaActual', jugador.get('manaTotal'));
	}
	if (jugador.get('ind') === 0) {
		document.getElementById('jugarCarta').className = document.getElementById('jugarCarta').className.replace('dis', '').trim();
		document.getElementById('pasarTurno').className = document.getElementById('pasarTurno').className.replace('dis', '').trim();
	} else {
		if (!document.getElementById('jugarCarta').hasClass('dis')) {
			document.getElementById('jugarCarta').className += ' dis';
		}
		if (!document.getElementById('pasarTurno').hasClass('dis')) {
			document.getElementById('pasarTurno').className += ' dis';
		}
	}

	var _minionsMareados = mesa.getElementsByClassName('campo')[getCampo(jugador)].getElementsByClassName('out')[0].getElementsByClassName('mareo');
console.log('VAR ** _minionsMareados', _minionsMareados);
	for (var i = 0; i < _minionsMareados.length; i++) {
		_minionsMareados[i].className = _minionsMareados[i].className.replace('mareo', '').trim();
	}

	setStatus(jugador);
}
function cleanup(jugador) {
console.log('FUNC ** cleanup(', jugador.get('nombre'), ')');

	setStatus(jugador);
}
function turnoIA(ia) {
console.log('FUNC ** turnoIA(', ia.get('nombre'), ')');
	var _cartasMano = ia.get('mano');
	for (var i = 0; i < _cartasMano.length; i++) {
		if (_cartasMano[i].cost <= ia.get('manaActual')) {
			jugarCarta(ia, _cartasMano[i]);
		}
	}
	mesa.dispatchEvent(evt_finTurno);
}
function finTurno(j, turnoActual) {
console.log('FUNC ** finTurno(', j[turnoActual].get('nombre'), ')');
	cleanup(j[turnoActual]);
	if (turnoActual === 0) {
		turnoActual = 1;
	} else {
		turnoActual = 0;
	}
	turno(j, turnoActual);
}
function jugarCarta(jugador, carta, dom) {
console.log('FUNC ** jugarCarta(', jugador.get('nombre'), carta, ')');
	var coste = carta.cost;
//console.log('CONTROL ** Coste carta', carta, coste);
	if (coste <= jugador.get('manaActual')) {

		evt_jugarCarta.detail.carta = carta;
		evt_jugarCarta.detail.jugador = jugador;
		mesa.dispatchEvent(evt_jugarCarta);

		if (carta.type === 'creature') {
			var _dom = DOMCartaMed(carta);
			if (carta.cargar === undefined) {
				_dom.className += ' mareo';
			}
			_dom.onclick = function() {
				if (this.parentNode.hasClass('out')) {
					if (!(this.hasClass('atacado') || this.hasClass('mareo'))) {
						console.log('CONTROL * ', carta, 'ataca');
						this.className += ' atacado';
					}
				}
			}
			mesa.getElementsByClassName('campo')[getCampo(jugador)].getElementsByClassName('out')[0].appendChild(_dom);
		}

		if (carta.type === 'spell') {
			carta.eff();
		}

		if (carta.type === 'weapon') {

		}

		if (carta.type === 'secret') {

		}

		jugador.set('manaActual', jugador.get('manaActual') - coste);
		if (jugador.get('ind') === 0 && dom) {
			dom.parentNode.removeChild(dom);
console.log('RENDER ** Quito de la mano', dom);
		}
		var mano = jugador.get('mano');
		mano.splice(mano.indexOf(carta));
		jugador.set('mano', mano);
		setStatus(jugador);
	}
}
function criaturaAtaca(jugador, carta) {
console.log('FUNC ** criaturaAtaca(', jugador.get('nombre'), carta, ')');

}
function DOMCartaMed(carta) {
console.log('FUNC ** DOMCartaMed(', carta, ')');
	var dom = document.createElement('div');
	dom.className = 'carta med';
	dom.cartaObj = carta;

	dom.innerHTML += '<label class="nombre">' + carta.nombre + '</label>';
	dom.innerHTML += '<label class="coste">' + carta.cost + '</label>';
	if (carta.desc) {
		dom.innerHTML += '<label class="desc">' + carta.desc + '</label>';
	}
	if (carta.type === 'creature') {
		dom.innerHTML += '<label class="att">' + carta.att + '</label>';
		dom.innerHTML += '<label class="def">' + carta.def + '</label>';
		if (carta.race) {
			dom.innerHTML += '<label class="raza">' + carta.race + '</label>';
		}
	}
	//dom.innerHTML += '<label class="rarity">' + carta.rarity + '</label>';

	return dom;
}
function DOMCartaSm(carta) {
console.log('FUNC ** DOMCartaSm(', carta, ')');
	var dom = document.createElement('div');
	dom.className = 'carta sm';
	dom.cartaObj = carta;

	dom.innerHTML += '<label class="nombre">' + carta.nombre + '</label>';
	dom.innerHTML += '<label class="coste">' + carta.cost + '</label>';
	var t;
	dom.onmouseenter = function() {
		t = setTimeout(function() {
			popup(carta, 'mouseLoc');
		}, 1000);
	}
	dom.onmouseleave = function() {
		clearTimeout(t);
	}
	dom.onclick = function() {
		if (this.hasClass('_sel_')) {
			this.className = this.className.replace('_sel_', '').trim();
		} else {
			var _domCartasMano = mesa.getElementsByClassName('mano')[0].getElementsByClassName('_sel_');
			for (var i = 0; i < _domCartasMano.length; i++) {
				_domCartasMano[i].className = _domCartasMano[i].className.replace('_sel_', '').trim();
			}
			this.className += ' _sel_';
			if (evt_inicioTurno.detail.jugador.get('ind') === 0) {
				if (this.cartaObj.cost > evt_inicioTurno.detail.jugador.get('manaActual')) {
					document.getElementById('jugarCarta').className += ' dis';
				} else {
					document.getElementById('jugarCarta').className = document.getElementById('jugarCarta').className.replace('dis', '').trim();
				}
			}
		}
	}
	return dom;
}
function getCampo(jugador) {
	if (jugador.get('ind') === 0) {
		return 1;
	} else {
		return 0;
	}
}
function setStatus(jugador) {
//console.log(jugador.get('manaActual'));
console.log('FUNC ** setStatus(', jugador.get('nombre'), ')');
	var campo = mesa.getElementsByClassName('campo')[getCampo(jugador)];
	campo.getElementsByClassName('status')[0].getElementsByClassName('mana')[0].innerText = jugador.get('manaActual');
	campo.getElementsByClassName('status')[0].getElementsByClassName('cartas_en_mazo')[0].innerText = jugador.get('mazo').cartas.length;
	campo.getElementsByClassName('status')[0].getElementsByClassName('vidas')[0].innerText = jugador.get('vida');
	campo.getElementsByClassName('status')[0].getElementsByClassName('armadura')[0].innerText = jugador.get('armadura');
}
function renderCartaMano(jugador, carta) {
	if (jugador.get('ind') === 0) {
console.log('FUNC ** renderCartaMano(', jugador.get('nombre'), carta, ')');
		mesa.getElementsByClassName('campo')[getCampo(jugador)].getElementsByClassName('mano')[0].appendChild(DOMCartaSm(carta, jugador.get('mazoRel').indexOf(carta)));
		return carta;
	}

}

// recursos --------------------------------------------------------
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
HTMLElement.prototype.hasClass = function (c) {
	return this.className.indexOf(c.toString()) > -1;
}
function popup(html, loc) {
	console.log('popup:', html, 'en', loc);
}
// objetos ---------------------------------------------------------
var Jugador = function(nombre, clase, mazo, _ind) {

	var private = {
		ind: _ind,
		nombre: nombre,
		vida: 30,
		armadura: 0,
		clase: clase,
		manaTotal: 0,
		manaActual: 0,
		mazo: mazo,
		mano: [],

		// aux
		danoRobar: 0, // Daño acumulativo por querer robar cartas sin tener en el mazo.
		mazoRel: [] // Orden de las cartas del mazo. Intangible. Sirve de refenencia (para relacionar dom y objeto).
		
	}

	return {
		get: function(prop) {
			if (private.hasOwnProperty(prop)) {
				return private[prop];
			}
		},

		set: function(prop, val) {
			if (private.hasOwnProperty(prop)) {
				private[prop] = val;
				return this;
			}
		}
	}
		
}

/*
var druida = {
	arma: null,
	habilidad = function() {

	}
}
*/
var Mago = function () {

	var private = {
		att: 0,
		dur: 0,
		lanzoHabilidad: false
	}

	this.habilidad = function() {
		private.lanzoHabilidad = true;
		return dmg(1, 'any');
	}
	
	return {
		get: function(prop) {
			if (private.hasOwnProperty(prop)) {
				return private[prop];
			}
		},

		set: function(prop, val) {
			if (private.hasOwnProperty(prop)) {
				private[prop] = val;
				return this;
			}
		}

	}

}

// flow	------------------------------------------------------------
window.onload = function() {
console.log('*************************************************** INICIO **************************************************');
	var mazoPruebas = {
		nombre: 'Mazo de pruebas j1',
		cartas: [
			set.comun.fuego_fatuo,
			set.comun.fuego_fatuo,
			set.comun.asaltante_murloc,
			set.comun.asaltante_murloc,
			set.comun.clamamareas_murloc,
			set.comun.escudera_argenta,
			set.comun.gnomo_paria
		]
	};

	var mazoPruebas0 = {
		nombre: 'Mazo de pruebas j2',
		cartas: [
			set.comun.fuego_fatuo,
			set.comun.fuego_fatuo,
			set.comun.asaltante_murloc,
			set.comun.asaltante_murloc,
			set.comun.clamamareas_murloc,
			set.comun.escudera_argenta,
			set.comun.gnomo_paria
		]
	};
	shuffle(mazoPruebas.cartas);
	shuffle(mazoPruebas0.cartas);

	j = [new Jugador('Yo', new Mago(), mazoPruebas, 0), 
			 new Jugador('El otro', new Mago(), mazoPruebas0, 1)];
/*
	for (var i = 0; i < j.length; i++) {
		var _cartas = j[i].get('mazo').cartas;
		for (var k = 0; k < _cartas.length; k++) {
			_cartas.dom = {
				sm: DOMCartaSm(_cartas[k])
			}
		}
	}
*/
//console.log('VAR ** mazoPruebas', mazoPruebas);
//console.log('VAR ** mazoPruebas0', mazoPruebas0);


console.log('FLOW ** Mazo inicial jugador 1', j[0].get('mazo'));
console.log('FLOW ** Mazo inicial jugador 2', j[1].get('mazo'));

	// Moneda
	var _empieza = Math.round(Math.random());
console.log('VAR ** _empieza', _empieza);	
	var _otro = (_empieza == 1 ? 0 : 1);
console.log('VAR ** _otro', _otro);
console.log('FLOW ** Empieza el jugador ' + parseInt(_empieza + 1));

	// Manos iniciales

	// El que empieza roba 3
	for (var i = 0; i < 3; i++) {
		robarCarta(j[_empieza]);
	}
console.log('FLOW ** Mano del jugador que empieza', j[_empieza].get('mano'));
console.log('FLOW ** Mazo del jugador que empieza', j[_empieza].get('mazo'));

	// El otro roba 4 y se queda con la moneda
	for (var i = 0; i < 4; i++) {
		robarCarta(j[_otro]);
	}
console.log('FLOW ** Mano del otro jugador', j[_otro].get('mano'));
console.log('FLOW ** Mazo del otro jugador', j[_otro].get('mazo'));

console.log('RENDER ** Renderizo hasta aquí. Saco sus manos, lo dejo listo para los descartes.');

	// Los jugadores se descartan de lo que no quieren
	var mesa = document.getElementById('mesa');

	var miCampo = mesa.getElementsByClassName('campo')[1];
	var miOut = miCampo.getElementsByClassName('out')[0];
	var miMano = miCampo.getElementsByClassName('mano')[0];

	var suCampo = mesa.getElementsByClassName('campo')[0];
	var suOut = suCampo.getElementsByClassName('out')[0];
	var suMano = suCampo.getElementsByClassName('mano')[0];

	document.getElementById('jugarCarta').onclick = function() {
		if (!this.hasClass('dis')) {
			jugarCarta(evt_inicioTurno.detail.jugador, miMano.getElementsByClassName('_sel_')[0].cartaObj, miMano.getElementsByClassName('_sel_')[0]);
		}
	}

	document.getElementById('pasarTurno').onclick = function() {
		if (!this.hasClass('dis')) {
			finTurno(j, turnoActual);
		}
	}

	// Creo las ventanas para descartes
	var modalDescartes = document.createElement('div');
	modalDescartes.className = 'modal';
	for (var i = 0; i < j[0].get('mano').length; i++) {
		var _carta = DOMCartaMed(j[0].get('mano')[i], j[0].get('mazoRel').indexOf(j[0].get('mano')[i]));
		_carta.onclick = function() {
			if (!this.hasClass('_sel_')) {
console.log('FUNC ** (Anonima) Selecciono', _carta, 'para descartes');
				this.className += ' _sel_';
			} else {
console.log('FUNC ** (Anonima) Deselecciono', _carta, 'para descartes');
				this.className = this.className.replace('_sel_', '').trim();
			}
		}
		modalDescartes.appendChild(_carta);
	}
	var _boton = document.createElement('div');
	_boton.innerText = 'Descartar';
	_boton.className = 'boton';
	_boton.onclick = function() {
		var _descartes = [];
		for (var i = 0; i < modalDescartes.getElementsByClassName('_sel_').length; i++) {
			// Posición en mi mano de esas cartas
			var _cartaSeleccionada = modalDescartes.getElementsByClassName('_sel_')[i];
			_descartes.push(Array.prototype.indexOf.call(_cartaSeleccionada.parentNode.childNodes, _cartaSeleccionada));
		}
console.log('VAR ** _descartes', _descartes);		
		modalDescartes.parentNode.removeChild(modalDescartes);
		descartes(j[0], _descartes);
	}

	modalDescartes.appendChild(_boton);
	mesa.appendChild(modalDescartes);
	var turnoActual = _empieza;
	mesa.addEventListener('onDescartesRdy', function(e) {
console.log('EVENT ** Un jugador ya está listo');
		e.detail.count++;
		if (e.detail.count === 2) {
			// Le doy la moneda aquí
			cartaAMano(j[_otro], set.aux.moneda);
			setStatus(j[0]);
			setStatus(j[1]);
console.log('*************************************************** FLOW **************************************************');

			/*
			mesa.addEventListener('onFinTurno', function(e) {
console.log('EVENT ** El jugador', j[turnoActual].get('nombre'), 'acaba su turno');
				cleanup(j[turnoActual]);
				if (turnoActual === 0) {
					turnoActual = 1;
				} else {
					turnoActual = 0;
				}
				//e.detail.jugador = jugador[ind];
				turno(j, turnoActual);
			}, false);
			*/
			turno(j, turnoActual);
		}
	}, false);

}