#include "graphNode.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>
#include <ncurses.h>

//prompts the user and changes the board dimensions for a MxN board
void changeBoardSize( int *dimensions ) {
	char dim1, dim2;
	mvprintw(0, 0,"Enter the board dimensions integer height M and integer width N:\n(Must be at least 4, but large board sizes may not display as expected)\n");
	scanw("%d %d", &dimensions[0], &dimensions[1]);
	//error check the input
	while ( dimensions[0] < 4 || dimensions[1] < 4 ) {
		clear();
		mvprintw(0,0,"Please enter integer board dimensions of at least 4:\n (Warning - large board sizes may not display as expected)\n");
		scanw("%d %d", &dimensions[0], &dimensions[1]);
	}
	return;
}

//prompts the user to change the game mode, player1 v player2, player1 v computer, or player1 v player1
void changeGameMode( char *mode ) {
	mvprintw(3,0,"Enter the game mode - pvp (player1 v player2), pvc (player1 v computer), or spg (player1 v player1):\n");
	scanw("%s", mode);
	//error check the input
	while ( !( strncmp(mode, "pvp", 3) == 0 || strncmp(mode, "pvc", 3) == 0 || strncmp(mode, "spg", 3) == 0 ) ) {
		move(4, 0);
		clrtoeol();
		mvprintw(3,0,"Enter the game mode - pvp (player1 v player2), pvc (player1 v computer), or spg (player1 v player1):\n");
		scanw("%s", mode);
	}
	return;
}

//sets the attributes based on the game mode
void resetPlayerStats( Player *p1, Player *p2, char mode[3] ) {
	strncpy(p1->name, "Player 1", 9); 
	p1->wins = 0;
	p1->color = 'R';
	p2->color = 'B';
	if ( strncmp(mode, "pvp", 3) == 0 ) {
		strncpy(p2->name, "Player 2", 9);
		p2->wins = 0;
	}
	else if ( strncmp(mode, "pvc", 3) == 0 ) {
		strncpy(p2->name, "Computer", 9);
		p2->wins = 0;
	}
	else if ( strncmp(mode, "spg", 3) == 0 ) {
		strncpy(p2->name, "Player 1", 9);
		p2->wins = 0;
	}
	return;
}

//game process
void gamePlay(void) {
	//prompt for dimensions
	int dimensions[2];
	changeBoardSize( dimensions );
	int M = dimensions[0];
	int N = dimensions[1];
	refresh();
	//curses function to use keyboard
	keypad(stdscr, TRUE);
	//prompt for game mode
	char mode[3];
	changeGameMode( mode );
	refresh();
	//initialize players
	Player p1;
	Player p2;
	resetPlayerStats( &p1, &p2, mode );
	//allocate memory for graph
	GraphNode **graph = (GraphNode **)malloc(M * sizeof( GraphNode *));
	for (int i = 0; i < M; i++) {
		graph[i] = (GraphNode *)malloc(N * sizeof( GraphNode ));
	}
	//create and display the graph on screen
	createGraph( M, N, graph );
	displayBoard( M, N, graph );
	refresh();
	//take turns, check for a winner, and display the winner
	char winningColor = fsm(mode, M, N, graph, p1, p2);
	if      ( winningColor == 'T' )      { printw("Tie!\n"); }
	else if ( winningColor == p1.color ) { p1.wins++; printw("%s Wins!\n", p1.name); }
	else if ( winningColor == p2.color ) { p2.wins++; printw("%s Wins!\n", p2.name); }
	//free the memory
	for (int i = 0; i < M; i++) {
		free(graph[i]);
	}
	free(graph);
	//print win statistics
	printw("\nWin Statistics: \n%s - %d \n%s - %d \n", p1.name, p1.wins, p2.name, p2.wins);
	//prompt the user to play again
	char play;
	printw("\nPlay again? Y/N\n");
	scanw("%c", &play);
	//while yes, repeat original process
	while ( play == 'Y' ) {
		clear();
		char answer;
		printw("Change the board size? Y/N - Warning: This will erase your win statistics!\n");
		scanw("%c", &answer);
		if ( answer == 'Y' ) {
			changeBoardSize( dimensions );
			M = dimensions[0];
			N = dimensions[1];
		}
		printw("Change the game mode? Y/N - Warning: This will erase your win statistics!\n");
		scanw("%c", &answer);
		if ( answer == 'Y' ) {
			changeGameMode( mode );
			resetPlayerStats( &p1, &p2, mode );
		}
		GraphNode **graph = (GraphNode **)malloc(M * sizeof( GraphNode *));
		for (int i = 0; i < M; i++) {
			graph[i] = (GraphNode *)malloc(N * sizeof( GraphNode ));
		}
		createGraph( M, N, graph );
		displayBoard( M, N, graph );
		winningColor = fsm(mode, M, N, graph, p1, p2);
		if      ( winningColor == 'T' )      { printw("Tie!\n"); }
		else if ( winningColor == p1.color ) { p1.wins++; printw("%s Wins!\n", p1.name); }
		else if ( winningColor == p2.color ) { p2.wins++; printw("%s Wins!\n", p2.name); }
		for (int i = 0; i < M; i++) {
			free(graph[i]);
		}
		free(graph);
		printw("\nWin Statistics: \n%s - %d \n%s - %d \n", p1.name, p1.wins, p2.name, p2.wins);
		printw("\nPlay again? Y/N\n");
		scanw("%c", &play);
	}
	return;
}
