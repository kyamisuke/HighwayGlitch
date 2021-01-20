#pragma once

#include "ofMain.h"
#include "ofxGui.h"

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();

		void keyPressed(int key);
		void keyReleased(int key);
		void mouseMoved(int x, int y );
		void mouseDragged(int x, int y, int button);
		void mousePressed(int x, int y, int button);
		void mouseReleased(int x, int y, int button);
		void mouseEntered(int x, int y);
		void mouseExited(int x, int y);
		void windowResized(int w, int h);
		void dragEvent(ofDragInfo dragInfo);
		void gotMessage(ofMessage msg);
		
    ofVideoPlayer video;
    ofFbo fbo, mosaic, mix, outline, blur;
    ofShader sobel, mos, glitch, mBlur;
    
    ofSoundPlayer sound;
    
    float* volume;
    float* fftSmoothed;
    int nBandsToGet;
        
    ofxPanel gui;
    ofxToggle sob, sobGray;
    
    float hCoef[9] = {1., 0., -1.,
                      2., 0., -2.,
                      1., 0., -1.};
    float vCoef[9] = {1., 2., 1.,
                      0., 0., -0.,
                      -1., -2., -1.};
};
