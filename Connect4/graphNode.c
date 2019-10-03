#include "graphNode.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>
#include <stdbool.h>

//sets the graph attributes to their initial values
void createGraph( int M, int N, GraphNode **graph ) {
	for (int i = 0; i < M; i++) {
		for (int j = 0; j < N; j++) {
			//N means no color
			graph[i][j].color = 'N';
			graph[i][j].x = i;
			graph[i][j].y = j;
		}
	}
	return;
}

//adds the player's move
GraphNode addMovePlayer( char color, GraphNode **graph, int newY, int M ) { 
	for (int i = 0; i < M; i++) {
		//if the last slot in the column is blank
		//add the chip to that slot
		//return the graph item
		if ( i == M-1 && graph[i][newY].color == 'N' ) {
			graph[i][newY].color = color;
			return graph[i][newY];
		}
		//if the slot below the current slot is still on the board and not blank
		//add the chip to that slot
		//return the graph item 
		if ( i+1 < M && graph[i+1][newY].color != 'N' ) {
			graph[i][newY].color = color;
			return graph[i][newY];
		}
	}
}

//recursive function that determines the computer's next move
void computerAI( int newY, int M, int N, GraphNode **graph, char color ) {
	//for each row in a given column
	for (int i = 0; i < M; i++) {
		//check if column is completely full
		if ( i == 0 && graph[i][newY].color != 'N' ) {
			//if yes, mark top slot as visited and increment the column
			//(circle to zero if the incremented column is out of range)
			graph[i][newY].visited = true;
			if ( newY+1 > N-1 ) { 
				computerAI( 0, M, N, graph, color);
			}
			else {
				computerAI( newY+1, M, N, graph, color);
			}
		}
		if ( graph[i][newY].visited == false ) {
			//if no, check to see that it hasn't been visited
			//add chip to the lowest row in the given column
			if ( i == M-1 && graph[i][newY].color == 'N' ) {
				graph[i][newY].color = color;
				return;
			}
			if ( i+1 < M && graph[i+1][newY].color != 'N' ) { 
				graph[i][newY].color = color; 
				return;
			}
		}
	}
}

//function to add computer's move, but calls computerAI() to calculate the next move
void addMoveComputer( char color, int M, int N, GraphNode **graph ) {
	//player's first move or not
	bool firstMove = true;
	//set all nodes to unvisited
	for (int i = 0; i < M; i++) {
		for (int j = 0; j < N; j++) {
			graph[i][j].visited = false;
		}
	}
	for (int i = 0; i < M; i++) {
		for (int j = 0; j < N; j++) {
			//if there are no slots on the board matching the color
			//it is the player's first move of the game
			if ( graph[i][j].color == color ) {
				firstMove = false;
				//mark as visited
				graph[i][j].visited = true;
				//if column is less than or equal to half the board
				//increment the column by 1, else decrement by 1
				if ( j <= (N-1)/2 ) {
					computerAI( j+1, M, N, graph, color );
					return;
				}
				else {
					computerAI( j-1, M, N, graph, color );
					return;
				}
			}
		}
	}
	//if it is the first move of the game
	//choose the lowest slot in a random column as long as it is empty
	srand(time(NULL));
	if ( firstMove == true ) {
		int newY = rand()%N;
		while ( graph[M-1][newY].color != 'N' ) {
			newY = rand()%N;
		}
		graph[M-1][newY].color = color;
	}
}
