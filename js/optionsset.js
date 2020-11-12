const numberOfOptions = 3;

(function (oG) { // checked
	const OptionsSet = function () {
		this.Container_constructor();
		this.clickerFun = this.clicker.bind(this);
		this.overerFun = this.overer.bind(this);
		this.outerFun = this.outer.bind(this);
		this.setup();
	};
	const p = createjs.extend(OptionsSet, createjs.Container);
	const xArrL = [150, 400, 650, 275, 525, 150, 400, 650];
	const yArrL = [255, 255, 255, 365, 365, 475, 475, 475];
	const xArrP = [150, 400, 275, 150, 400, 275, 150, 400];
	const yArrP = [275, 275, 385, 495, 495, 605, 715, 715];

	// 0 - char
	// 1 - eng
	// 2 - pin
	// 3 - char pin
	// 4 - char eng
	// 5 - char eng pin
	// 6 - eng pin
	// 7 - none

	const charY = [0, 0, 0, -14, -12, -24, 0, 0];
	const charSize = [0.6, 0, 0, 0.5, 0.5, 0.4, 0, 0];
	const engY = [9, 7, 9, 9, 28, 33, 24, 9];
	const engSize = [0, 24, 0, 0, 24, 18, 24, 0];
	const pinY = [9, 9, 9, 28, 9, 14, -2, 9];
	const pinSize = [0, 0, 26, 22, 0, 22, 26, 0];

	p.setup = function () {
		this.bits = [];
		this.scrambleArr = [];
		for (let i = 0; i < numberOfOptions; i++) {
			this.scrambleArr[i] = i;
			this.bits[i] = new oG.Modules.OptionBit(i);
			this.addChild(this.bits[i]);
		}
		this.setupDisplay();
	};

	p.setupDisplay = function () {
		let i = 0;
		if (oG.model.orientation === 0) { // number of options here
			for (i = 0; i < numberOfOptions; i++) {
				opdLib.posItem(this.bits[i], xArrL[i], yArrL[i]);
			}
		} else {
			for (i = 0; i < numberOfOptions; i++) { // number of options here
				opdLib.posItem(this.bits[i], xArrP[i], yArrP[i]);
			}
		}
	};

	p.orientationChange = function () {
		this.setupDisplay();
	};

	p.adjDisp = function () {
		const cDisp = oG.model.optView;
		const cY = charY[cDisp];
		const cS = charSize[cDisp];
		const eY = engY[cDisp];
		const eS = engSize[cDisp];
		const pY = pinY[cDisp];
		const pS = pinSize[cDisp];
		for (let i = 0; i < numberOfOptions; i++) this.bits[i].adjDisp(cY, cS, eY, eS, pY, pS);
	};

	p.showSet = function (gArr) {
		this.scrambleArr = opdLib.shuffleArray(this.scrambleArr);
		for (let i = 0; i < numberOfOptions; i++) {
			this.bits[this.scrambleArr[i]].showItem(gArr[i]);
			this.bits[i].visible = true;
			this.bits[i].front.visible = true;
		}
		this.cTar = this.scrambleArr[0];
	};

	p.addLists = function () {
		this.addEventListener('click', this.clickerFun);
		if (!oG.model.touchMode) {
			this.addEventListener('mouseover', this.overerFun);
			this.addEventListener('mouseout', this.outerFun);
			this.cursor = 'pointer';
		}
	};

	p.removeLists = function () {
		this.removeEventListener('click', this.clickerFun);
		if (!oG.model.touchMode) {
			this.removeEventListener('mouseover', this.overerFun);
			this.removeEventListener('mouseout', this.outerFun);
			this.cursor = 'default';
		}
	};

	p.clicker = function (e) {
		this.removeLists();
		if (e.target.ind === this.cTar) {
			this.removeRest();
			oG.view.gameView.correctHit();
		} else {
			this.bits[e.target.ind].visible = false;
			oG.view.gameView.missHit();
		}
	};

	p.removeRest = function () {
		for (let i = 0; i < numberOfOptions; i++) {
			this.bits[i].visible = false;
		}
		this.bits[this.cTar].visible = true;
	};

	p.removeAnother = function () {
		let removed = false;
		let lVar = 0;
		while (removed === false && lVar < numberOfOptions) {
			if (this.bits[lVar].visible === true && lVar != this.cTar) {
				removed = true;
				this.bits[lVar].visible = false;
			}
			lVar++;
		}
	};

	p.overer = function (e) {
		e.target.front.visible = false;
	};

	p.outer = function (e) {
		e.target.front.visible = true;
	};

	p.init = function () {
		for (let i = 0; i < numberOfOptions; i++) {
			this.bits[i].init();
		}
		this.adjDisp();
	};

	p.deit = function () {
		for (let i = 0; i < numberOfOptions; i++) {
			this.bits[i].deit();
		}
		this.removeLists();
	};

	oG.Modules.OptionsSet = createjs.promote(OptionsSet, 'Container');
}(opdGame));

(function (oG) {
	const OptionBit = function (gInd) {
		this.Container_constructor();
		this.ind = gInd;
		this.setup();
	};
	const p = createjs.extend(OptionBit, createjs.Container);

	p.setup = function () {
		this.mouseChildren = false;
		const back = new createjs.Sprite(oG.model.mainSprite);
		this.front = new createjs.Sprite(oG.model.mainSprite);
		back.gotoAndStop('itemBack');
		this.front.gotoAndStop('itemFront');
		opdLib.dispItem(back, this, -125, -55);
		opdLib.dispItem(this.front, this, -125, -55);

		this.pText = new createjs.Text('pinyin', 'bold 24px Ubuntu', '#666');
		this.eText = new createjs.Text('english', 'bold 24px Cabin', '#fff');
		opdLib.centerText(this.pText);
		opdLib.centerText(this.eText);
		this.addChild(this.pText);
		this.addChild(this.eText);
	};

	p.showItem = function (gInd) {
		this.cText.gotoAndStop(gInd);
		this.eText.text = oG.model.textArray[gInd];
		this.pText.text = oG.model.pinArray[gInd];
	};

	p.adjDisp = function (cY, cS, eY, eS, pY, pS) {
		if (cS === 0) {
			this.cText.visible = false;
		} else {
			this.cText.visible = true;
			this.cText.y = cY;
			this.cText.scaleX = this.cText.scaleY = cS;
		}
		if (eS === 0) {
			this.eText.visible = false;
		} else {
			this.eText.visible = true;
			this.eText.y = eY;
			this.eText.font = `bold ${eS}px Cabin`;
		}
		if (pS === 0) {
			this.pText.visible = false;
		} else {
			this.pText.visible = true;
			this.pText.y = pY;
			this.pText.font = `bold ${pS}px Ubuntu`;
		}
	};

	p.init = function () {
		this.front.visible = true;

		this.cText = new createjs.Sprite(oG.model.contentSpriteSheet);
		this.addChild(this.cText);
	};

	p.deit = function () {
		this.removeChild(this.cText);
		this.cText = null;
	};

	oG.Modules.OptionBit = createjs.promote(OptionBit, 'Container');
}(opdGame));
