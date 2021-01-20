#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    ofBackground(0);
    ofSetFrameRate(60);
    ofSetVerticalSync(true);
    
    // load video file
    video.load("highway.mp4");
    video.setSpeed(600.0);
    video.setVolume(0.0);
    video.play();
    video.setLoopState(OF_LOOP_NORMAL);
    //    sound.load("HIROsan.mp3");
    //    sound.setVolume(1.0);
    //    sound.play();
    //    sound.setLoop(true);
    
    fftSmoothed = new float[8192];
    for (int i=0; i<8192; i++) {
        fftSmoothed[i] = 0;
    }
    nBandsToGet = 300;
    
    // load shader file
    sobel.load("sobel.vert", "sobel.frag");
    mos.load("mosaic.vert", "mosaic.frag");
    glitch.load("glitch.vert", "glitch.frag");
    mBlur.load("motionBlur.vert", "motionBlur.frag");
    
    // allocate fbo file
    fbo.allocate(ofGetWidth(), ofGetHeight());
    mix.allocate(ofGetWidth(), ofGetHeight());
    mosaic.allocate(ofGetWidth(), ofGetHeight());
    outline.allocate(ofGetWidth(), ofGetHeight());
    blur.allocate(ofGetWidth(), ofGetHeight());

    // setup gui parameter
    gui.setup();
    gui.setPosition(10, 10);
    gui.add(sob.setup("sobel", true));
    gui.add(sobGray.setup("sobelGray", false));
}

//--------------------------------------------------------------
void ofApp::update(){
    //    ofSoundUpdate();
    //
    //    volume = ofSoundGetSpectrum(nBandsToGet);
    //    for (int i=0; i<nBandsToGet; i++) {
    //        this->fftSmoothed[i] *= 0.96f;
    //        if (this->fftSmoothed[i] < volume[i]) {
    //            this->fftSmoothed[i] = volume[i];
    //        }
    //    }
    
    video.update();

    // make a movie fbo
    fbo.begin();
    ofClear(0, 0, 0, 0);
    video.draw(0, 0);
    fbo.end();
    
    // draw a mosaic
    this->mosaic.begin();
    ofClear(0, 0, 0, 0);
    this->mos.begin();
    this->mos.setUniform2f("resolution", ofGetWidth(), ofGetHeight());
    this->mos.setUniform1f("time", ofGetFrameNum());
    
    ofDrawRectangle(0, 0, ofGetWidth(), ofGetHeight());
    this->mos.end();
    this->mosaic.end();
    
    // sobel filter
    outline.begin();
    ofClear(0, 0, 0, 0);

    sobel.begin();
    sobel.setUniform1f("time", ofGetElapsedTimef());
    sobel.setUniform2f("resolution", ofGetWidth(), ofGetHeight());
    sobel.setUniformTexture("tex", fbo.getTexture(), 0);
    sobel.setUniform1fv("hCoef", &hCoef[0], 9);
    sobel.setUniform1fv("vCoef", &vCoef[0], 9);
    sobel.setUniform1i("sobel", sob);
    sobel.setUniform1i("sobelGray", sobGray);
    
    ofPushMatrix();
    ofScale(1.3);
    fbo.draw(0, 0);
    ofPopMatrix();
    sobel.end();
    outline.end();
    
    // motion blur
//    blur.begin();
//    ofClear(0, 0, 0, 0);
//
//    mBlur.setUniform1f("time", ofGetElapsedTimef());
//    mBlur.setUniform2f("resolution", ofGetWidth(), ofGetHeight());
//    mBlur.setUniformTexture("tex", fbo.getTexture(), 0);
//
//    fbo.draw(0, 0);
//    blur.end();
}

//--------------------------------------------------------------
void ofApp::draw(){
    // apply some glitch
    glitch.begin();
    glitch.setUniform1f("time", ofGetElapsedTimef());
    glitch.setUniform2f("resolution", ofGetWidth(), ofGetHeight());
    glitch.setUniformTexture("tex", outline.getTexture(), 0);
    glitch.setUniformTexture("mosTex", mosaic.getTexture(), 1);

    outline.draw(0, 0);
    glitch.end();

    
//    outline.draw(0, 0);
//    mosaic.draw(0, 0);
    
//    gui.draw();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){
    
}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){
    
}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){
    
}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){
    
}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){
    
}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){
    
}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 
    
}
