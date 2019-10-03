#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <ncurses.h>

//in graphNode.c
typedef struct GraphNode {
	int x;
	int y;
	char color;
	bool visited;
} GraphNode;

void createGraph( int M, int N, GraphNode **graph );
GraphNode addMovePlayer( char color, GraphNode **graph, int newY, int M ); 
void computerAI( int newY, int M, int N, GraphNode **graph, char color );
void addMoveComputer( char color, int M, int N, GraphNode **graph );

//in player.c
typedef struct Player {
	int wins;
	char color;
	char name[8];
} Player;

typedef enum {
	P1_TURN, P2_TURN, COMP_TURN
} STATE;

bool horizontal( int M, int N, GraphNode **graph );
bool vertical( int M, int N, GraphNode **graph );
bool rightDiag( int M, int N, GraphNode **graph );
bool leftDiag( int M, int N, GraphNode **graph );
char fsm( char mode[3], int M, int N, GraphNode **graph, Player p1, Player p2 );

//in gamePlay.c
void changeBoardSize( int *dimensions );
void changeGameMode( char *mode );
void resetPlayerStats( Player *p1, Player *p2, char mode[3] );
void gamePlay(void);

//in main.c
void horizontalLine(void);
void print_slot( char color );
int moveSelectCol( int N );
void displayBoard( int M, int N, GraphNode **graph );	
