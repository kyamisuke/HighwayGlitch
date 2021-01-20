#version 150

uniform float time;
uniform vec2 resolution;
uniform sampler2DRect tex;

in vec2 vTexCoord;

out vec4 outputColor;

vec2 scale(vec2 p, float d) {
    return (p - vec2(.5)) * (1. - d) + vec2(.5);
}

void main(void) {

    float N = 20.;
    vec3 blur = vec3(0.);

    for (int i=0; i < N; i++) {
        float d = float(i) * 0.002;

        blur.r += texture(tex, scale(vTexCoord, d * 7.)).r;
        blur.g += texture(tex, scale(vTexCoord, d * 4.)).g;
        blur.b += texture(tex, scale(vTexCoord, d * 1.)).b;
    }
    blur /= N;

    outputColor = vec4(blur, 1.);

}
