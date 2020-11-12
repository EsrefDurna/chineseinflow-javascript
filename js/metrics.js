(function (oG) { // checked
	const lArr = [];
	let sArr = [];
	let sdSeq = [];
	let sdArr = [];
	let nLoop = 0;

	function initLoc() {
		for (let i = 0; i < 30; i++) {
			sArr[i] = i;
			lArr[i] = 0;
			sdSeq[i] = i;
			sdArr[i] = i;
		}
		sdSeq = opdLib.shuffleArray(sdSeq);
		sArr = opdLib.shuffleArray(sArr);
		nLoop = 0;
		oG.model.sdCount = 0;
	}

	function getRoundLoc() {
		if (oG.model.sdMode) {
			return sdRound();
		}
		return stRound();
	}

	function sdRound() {
		if (oG.model.sdCount < 30) {
			const sVar = sdSeq[oG.model.sdCount];
			sdArr = opdLib.shuffleArrayForceInitial(sdArr, sVar);
			oG.model.sdCount++;
			return sdArr.slice(0, 8);
		}
		return [-1];
	}

	function stRound() {
		const end = nLoop + 8;
		const curRun = sArr.slice(nLoop, end);
		return curRun;
	}

	function hitLoc() {
		if (oG.model.sdMode) {
		} else {
			if (checkGood()) oG.model.sdStart = true;
			// oG.model.sdStart=true;

			const cur = sArr[nLoop];
			if (!oG.model.missBool) {
				lArr[cur]--;
			} else {
				lArr[cur] = 2;
			}
			if (lArr[cur] <= 0) {
				nLoop++;
				if (nLoop == 23) {
					nLoop = 22;
					prodDrop(8);
				}
			}
			if (lArr[cur] === 1) prodDrop(14);
			if (lArr[cur] == 2) prodDrop(5);
		}
	}

	function prodDrop(gLen) {
		const add = Math.floor(Math.random() * 4);
		const len = gLen + add;
		let lim = nLoop + len;
		if (lim > 29) lim = 29;
		const tmp = sArr[nLoop];
		for (let i = nLoop; i < lim; i++) {
			sArr[i] = sArr[i + 1];
		}
		sArr[lim] = tmp;
	}

	function checkGood() {
		let i = 0;
		if (oG.model.routineInd == 8) {
			if (oG.model.misses < 2) return true;
		}
		if (oG.model.routineInd == 15) {
			if (oG.model.misses < 3) return true;
		}
		if (oG.model.routineInd == 30) {
			if (oG.model.misses < 7) return true;
		}
		if (nLoop == 22) {
			let cnt = 0;
			for (i = 0; i < 8; i++) {
				const cInd = lArr[nLoop + i];
				cnt += cInd;
				if (cInd == 2) return false;
			}
			if (cnt < 5) return true;
		}
		return false;
	}

	function deitLoc() {
		oG.model.gameScore = oG.model.sdCount;
	}

	oG.metrics = {
		init: initLoc, deit: deitLoc, getRound: getRoundLoc, hit: hitLoc,
	};
}(opdGame));
