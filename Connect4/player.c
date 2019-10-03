#include "graphNode.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>
#include <ncurses.h>

//checks to see if a winner was found horizontally
bool horizontal( int M, int N, GraphNode **graph ) {
	for (int i = 0; i < M; i++) {
		for (int j = 0; j < N-3; j++) {
			if ( graph[i][j].color == graph[i][j+1].color && graph[i][j+1].color == graph[i][j+2].color && graph[i][j+2].color == graph[i][j+3].color && graph[i][j].color != 'N' ) {
				return true;
			}
		}
	}
	return false;
}

//checks to see if a winner was found vertically
bool vertical( int M, int N, GraphNode **graph ) {
	for (int i = 0; i < M-3; i++) {
		for (int j = 0; j < N; j++) {
			if ( graph[i][j].color == graph[i+1][j].color && graph[i+1][j].color == graph[i+2][j].color && graph[i+2][j].color == graph[i+3][j].color && graph[i][j].color != 'N' ) {
				return true;
			}
		}
	}
	return false;
}

//checks to see if a winner was found by going up and left or down and right
bool rightDiag( int M, int N, GraphNode **graph ) {
	for ( int i = 0 ; i < M-3; i++) {
		for (int j = 0; j < N-3; j++) {
			if ( graph[i][j].color != 'N' && graph[i][j].color == graph[i+1][j+1].color && graph[i+1][j+1].color == graph[i+2][j+2].color && graph[i+2][j+2].color == graph[i+3][j+3].color ) {
				return true;
			}
		}
	}
	return false;
}

//checks to see if a winner was found by going up and right or down and left
bool leftDiag(int M, int N, GraphNode **graph ) {
	for ( int i = 0; i < M-3; i++) {
		for (int j = 3; j < N; j++) {
			if ( graph[i][j].color != 'N' && graph[i][j].color == graph[i+1][j-1].color && graph[i][j].color == graph[i+2][j-2].color && graph[i][j].color == graph[i+3][j-3].color ) {
				return true;
			}
		}
	}
	return false;
}

//finite state machine that controls whose turn it is to play
char fsm( char mode[3], int M, int N, GraphNode **graph, Player p1, Player p2 ) {
	STATE cur_state;
	cur_state = P1_TURN;
	int newX, newY = 0;
	int slotsFilled = 0;
	GraphNode newMove;
	while(1) {
		switch( cur_state ) {
			case P1_TURN:
				refresh();
				//player 1 adds their move
				if ( slotsFilled == M*N ) { return 'T'; }
				printw("%s\'s turn!\n", p1.name);
				printw("\nWin Statistics: \n%s - %d \n%s - %d \n", p1.name, p1.wins, p2.name, p2.wins);
				newY = moveSelectCol(N);
				while ( graph[0][newY].color != 'N' ) {	newY = moveSelectCol(N); }
				newMove = addMovePlayer( p1.color, graph, newY, M ); 
				refresh();
				slotsFilled++;
				displayBoard( M, N, graph );	
				if ( horizontal(M, N, graph) || vertical(M, N, graph) || rightDiag(M, N, graph) || leftDiag(M, N, graph) ) { return p1.color; }
				if      ( strncmp(mode, "pvp", 3) == 0 ) { cur_state = P2_TURN; }
				else if ( strncmp(mode, "pvc", 3) == 0 ) { cur_state = COMP_TURN; }
				else if ( strncmp(mode, "spg", 3) == 0 ) { cur_state = P2_TURN; }
				break;
			case P2_TURN:
				//player 2 adds their move
				if ( slotsFilled == M*N ) { return 'T'; }
				printw("%s\'s turn!\n", p2.name);
				printw("\nWin Statistics: \n%s - %d \n%s - %d \n", p1.name, p1.wins, p2.name, p2.wins);
				newY = moveSelectCol(N);
				while ( graph[0][newY].color != 'N' ) { newY = moveSelectCol(N); }
				newMove = addMovePlayer( p2.color, graph, newY, M ); 
				refresh();
				slotsFilled++;
				displayBoard( M, N, graph );	
				if ( horizontal(M, N, graph) || vertical(M, N, graph) || rightDiag(M, N, graph) || leftDiag(M, N, graph) ) { return p2.color; }
				cur_state = P1_TURN;
				break;
			case COMP_TURN:
				//computer adds its move
				if ( slotsFilled == M*N ) { return 'T'; }
				printw("\nWin Statistics: \n%s - %d \n%s - %d \n", p1.name, p1.wins, p2.name, p2.wins);
				addMoveComputer( p2.color, M, N, graph );
				slotsFilled++;
				displayBoard( M, N, graph );	
				if ( horizontal(M, N, graph) || vertical(M, N, graph) || rightDiag(M, N, graph) || leftDiag(M, N, graph)) { return p2.color; }
				cur_state = P1_TURN;
				break;
		}
	}
}

