

uniform sampler2D uTexture;

//  varying float vSmokeProgress;



void main() {

  float alphaTexture = texture(uTexture, gl_PointCoord).r;

  // vec3 Color = mix(uColorA,uColorB, vFireProgress);

  vec3 Color = vec3(1.0);

  gl_FragColor = vec4(Color, alphaTexture);

   #include <tonemapping_fragment>
}