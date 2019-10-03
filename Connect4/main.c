#include "graphNode.h"

#include <ncurses.h>
#include <stdio.h>
#include <string.h>
#include <stdio.h>

#define P1_PAIR    1
#define P2_PAIR    2
#define BOARD_PAIR 3
#define BLANK_PAIR 4
#define PATH_PAIR  5

//prints the horizontal lines on screen
void horizontalLine() {
	for (int i = 0; i < 3; i++) { 
		addch(ACS_HLINE);
	}
}

//prints the slots in the correct color using curses
void print_slot( char color ) {
	if ( color == 'N' ) {
		attron( COLOR_PAIR(BLANK_PAIR) );
		addch('O');
		attroff( COLOR_PAIR(BLANK_PAIR) );
	}
	else if ( color == 'R' ) {
		attron( COLOR_PAIR(P1_PAIR) );
		addch('O');
		attroff( COLOR_PAIR(P1_PAIR) );
	}
	else if ( color == 'B' ) {
		attron( COLOR_PAIR(P2_PAIR) );
		addch('O');
		attroff( COLOR_PAIR(P2_PAIR) );
	}
}

//prints the columns selection menu
//idea from http://tldp.org/HOWTO/NCURSES-Programming-HOWTO/keys.html
void printScreen(int select, int N, char col_choices[N]) {
	int x = 2;
	int y = 1;
	for (int i = 0; i < N; ++i) {
		if ( select == i+1 ) {
			attron(A_REVERSE);
			mvwprintw(stdscr, y, x, "%c", col_choices[i]);
			attroff(A_REVERSE);
		}
		else {
			mvwprintw(stdscr, y, x, "%c", col_choices[i]);
		}
		x += 4;
	}
	refresh();
}

//columns selection menu function
int moveSelectCol(int N) {
	int select = 1;
	int choice = 0;
	int ch;

	char col_choices[N];
	for (int i = 0; i < N; i++) {
		col_choices[i] = 'V';
	}
	mvprintw(0,0, "Use the left and right arrow keys and press enter to place your move");
	curs_set(0);
	refresh();
	printScreen(select, N, col_choices);
        while(1) {
		ch = getch();
		switch(ch) {
			case KEY_LEFT:
				if ( select == 1) { select = N; }
				else { --select; }
				break;
			case KEY_RIGHT:
				if ( select == N ) { select = 1; }
				else { ++select; }
				break;
			case 10: //pressed enter
				choice = select;
				break;
			default:
				refresh();
				break;
		}
		printScreen(select, N, col_choices);
		if ( choice != 0 ) { break; }
	}
	refresh();
	return (choice-1);
}

//displays the Connect 4 board using curses
void displayBoard( int M, int N, GraphNode **graph ) {	
	if (has_colors() == FALSE) {	
		endwin();
		printf("Your terminal does not support color\n");
	}
	start_color();
	init_pair(P1_PAIR, COLOR_RED, COLOR_BLACK);
	init_pair(P2_PAIR, COLOR_BLUE, COLOR_BLACK);
	init_pair(BOARD_PAIR, COLOR_YELLOW, COLOR_BLACK);
	init_pair(BLANK_PAIR, COLOR_WHITE, COLOR_BLACK);
	init_pair(PATH_PAIR, COLOR_GREEN, COLOR_BLACK);
	clear();
	addch('\n');
	addch('\n');
	attron( COLOR_PAIR(BOARD_PAIR) );
	addch(ACS_ULCORNER);
        horizontalLine();	
	for ( int k = 0; k < N-1; k++ ) {
		addch(ACS_TTEE); 
        	horizontalLine();	
	}	
	addch(ACS_URCORNER); 
	addch('\n');
	for (int j = 0; j < N; j++) {
		addch(ACS_VLINE); 
		addch(32);
		attroff( COLOR_PAIR(BOARD_PAIR) );
		print_slot( graph[0][j].color );
		attron( COLOR_PAIR(BOARD_PAIR) );
		addch(32);
	}
	addch(ACS_VLINE); 
	addch('\n');
	for (int i = 1; i < M; i++) {	
		addch(ACS_LTEE);
       		horizontalLine();	
		for ( int k = 0; k < N-1; k++ ) {
			addch(ACS_PLUS); 
        		horizontalLine();	
		}
		addch(ACS_RTEE);
		addch('\n');
		for (int j = 0; j < N; j++) {
			addch(ACS_VLINE); 
			addch(32);
			attroff( COLOR_PAIR(BOARD_PAIR) );
			print_slot( graph[i][j].color );
			attron( COLOR_PAIR(BOARD_PAIR) );
			addch(32);
		}
		addch(ACS_VLINE); 
		addch('\n');
	}
	addch(ACS_LLCORNER);
        horizontalLine();	
	for ( int k = 0; k < N-1; k++ ) {
		addch(ACS_BTEE); 
        	horizontalLine();	
	}
	addch(ACS_LRCORNER);
	attroff( COLOR_PAIR(BOARD_PAIR) );
	addch('\n');
	refresh();
}

int main(void) {

	initscr();
	clear();
	cbreak();
	scrollok(stdscr, 1);

	gamePlay(); 
	endwin();
	return 0;
}
