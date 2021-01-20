#version 150

uniform float time;
uniform vec2 resolution;
uniform sampler2DRect tex;
uniform sampler2DRect mosTex;

in vec2 vTexCoord;

out vec4 outputColor;

#define RGBSHIFT
#define OLDSCREENLINES
#define NUMBER_LINES 269.

const float F3 =  0.3333333;
const float G3 =  0.1666667;


float rand(float seed){
    return fract(sin(dot(vec2(seed) ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}


vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

const mat3 rot1 = mat3(-0.37, 0.36, 0.85,-0.14,-0.93, 0.34,0.92, 0.01,0.4);
const mat3 rot2 = mat3(-0.55,-0.39, 0.74, 0.33,-0.91,-0.24,0.77, 0.12,0.63);
const mat3 rot3 = mat3(-0.71, 0.52,-0.47,-0.08,-0.72,-0.68,-0.7,-0.45,0.56);


float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/

	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));

	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);

	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;

	 /* 2. find four surflets and store them in d */
	 vec4 w, d;

	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);

	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);

	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);

	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;

	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

float simplex3d_fractal(vec3 m) {
    return   0.5333333*simplex3d(m*rot1)
			+0.2666667*simplex3d(2.0*m*rot2)
			+0.1333333*simplex3d(4.0*m*rot3)
			+0.0666667*simplex3d(8.0*m);
}


vec2 displace(vec2 co, float seed, float seed2) {
    vec2 shift = vec2(0);
    if (rand(seed) > 0.5) {
        shift += 0.1 * vec2(2. * (0.5 - rand(seed2)));
    }
    if (rand(seed2) > 0.6) {
        if (co.y > 0.5) {
            shift.x *= rand(seed2 * seed);
        }
    }
    return shift*500.;
}

vec4 interlace(vec3 co, vec4 col) {
    col += simplex3d_fractal(co*8.0+8.0)*0.3;
    //col *= smoothstep(0.0, 0.005, abs(0.6-co.x)); // hello, iq :)

    return col;
}

vec2 scale(vec2 p, float d) {
    return (p - vec2(.5)) * (1. - d) + vec2(.5);
}

void main(void) {
    vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / resolution.xy;
    vec2 rDisplace = vec2(0);
    vec2 gDisplace = vec2(0);
    vec2 bDisplace = vec2(0);
    float rcolor;
    float gcolor;
    float bcolor;

    rDisplace = displace(vTexCoord, time * 2., 2. + time);
    gDisplace = displace(vTexCoord, time * 3., 3. + time);
    bDisplace = displace(vTexCoord, time * 5., 5. + time);

    rDisplace.x += 5. * (0.5 - rand(time * 37. * vTexCoord.y));
    gDisplace.x += 7. * (0.5 - rand(time * 47. * vTexCoord.y));
    bDisplace.x += 1. * (0.5 - rand(time * 57. * vTexCoord.y));

    rDisplace.y += 1. * (0.5 - rand(time * 37. * vTexCoord.x));
    gDisplace.y += 1. * (0.5 - rand(time * 47. * vTexCoord.x));
    bDisplace.y += 1. * (0.5 - rand(time * 57. * vTexCoord.x));

    // float N = 20.;
    //
    // for (int i=0; i < N; i++) {
    //     float d = float(i) * 0.002;
    //
    //     outputColor.r += texture(tex, scale(vTexCoord, d * 7.)).r;
    //     outputColor.g += texture(tex, scale(vTexCoord, d * 4.)).g;
    //     outputColor.b += texture(tex, scale(vTexCoord, d * 1.)).b;
    // }
    //
    // outputColor /= N;
    // outputColor.a = 1.0;


    vec4 mos = texture(mosTex, vTexCoord);
    vec2 id = floor(p * 400.);
    float y = id.y + time;
    // float n = pow(sin(y), 6.)*sin(y)*pow(sin(y), 3.)*20.;
    float n = 0;
    if (mos.rgb == vec3(0.0)) {
        rcolor = texture(tex, vTexCoord.xy + vec2(8., 0.) + n).r;
        gcolor = texture(tex, vTexCoord.xy + n).g;
        bcolor = texture(tex, vTexCoord.xy - vec2(8., 0.) + n).b;
    } else {
        rcolor = texture(tex, vTexCoord.xy + vec2(100., 0.) + rDisplace + n).r;
        gcolor = texture(tex, vTexCoord.xy + vec2(100., 0.) + gDisplace + n).g;
        bcolor = texture(tex, vTexCoord.xy + vec2(100., 0.) + bDisplace + n).b;
    }

    vec3 co = vec3(vTexCoord, time);
    outputColor = interlace(co, vec4(rcolor, gcolor, bcolor, 1.));

}
