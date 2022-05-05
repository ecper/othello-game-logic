import { Component } from "@angular/core";
import { createStore, ActionCreator } from "othello-game-logic";
import Swal from "sweetalert2";
@Component({
	selector: "app-home",
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"],
})
export class HomePage {
	store = createStore();
	state: any;
	userState: string;
	constructor() {
		console.log(this.store);
		console.log(this.store._state.board);
		this.store.subscribe((status) => {
			this.state = status;
			if (this.state.gameState.includes("win")) {
				this.store.dispatch(ActionCreator.reset());
			}
		});
	}

	cpuSelectStone(state: string) {
		if (state === "white") {
			const rowRandom = Math.floor(
				Math.random() * this.state.black.placeableCells.length
			);
			const placeableCell = this.state.black.placeableCells[rowRandom];
      console.log(placeableCell)
			this.store.dispatch(
				ActionCreator.putStone(placeableCell.x, placeableCell.y, "black")
			);
		} else {
			const rowRandom = Math.floor(
				Math.random() * this.state.white.placeableCells.length
			);
			const placeableCell = this.state.white.placeableCells[rowRandom];
			console.log(rowRandom, placeableCell);
			this.store.dispatch(
				ActionCreator.putStone(placeableCell.x, placeableCell.y, "white")
			);
		}
	}

	setPlayer(state: string) {
		this.userState = state;
		this.store.dispatch(ActionCreator.startGame());
		if (state === "white") {
			setTimeout(() => {
				this.cpuSelectStone(state);
			}, 2000);
		}
		// this.store.dispatch(ActionCreator.putStone(3, 5, "white"));
	}

	setStone(row: number, col: number, gameState: string) {
		this.store.dispatch(ActionCreator.putStone(col, row, gameState));
		try {
			setTimeout(() => {
				this.cpuSelectStone(this.userState);
			}, 2000);
		} catch {
			Swal.fire({
				heightAuto: false,
				title: this.state.gameState + "win",
				text: "gameEnd",
			});
		}
	}

	checkPlaceable(row: number, col: number, gameState: string) {
		if (gameState === "black") {
			for (let cell of this.state.black.placeableCells) {
				if (cell.x === col && cell.y === row) {
					return true;
				}
			}
		} else if (gameState === "white") {
			for (let cell of this.state.white.placeableCells) {
				if (cell.x === col && cell.y === row) {
					return true;
				}
			}
		}
	}

	checkColor(colCell: number) {
		switch (colCell) {
			case 1:
				return "dark";
			case -1:
				return "white";
			default:
				return "success";
		}
	}
}
