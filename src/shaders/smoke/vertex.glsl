 uniform float uSize;
uniform float uTime;
uniform float uLife;
uniform float uTimeCoEfficent;
uniform vec2 uResolution;


 attribute float aSize;
 attribute float aTimeMultiplier;

 varying float vSmokeProgress;

#include ../includes/remap.glsl
 
 void main(){

    vec3 newPosition = position;
    float life = mod(uTime * aTimeMultiplier * uTimeCoEfficent , uLife);
    newPosition.y += life;

    float smokeProgress = remap(life, 0.0, uLife, 1.0, 0.0);
    smokeProgress = clamp(smokeProgress, 0.0, 1.0);

    //scalling
    float sizeOpeningProgress = remap(life, 0.0, 0.1, 0.0, 1.0);
    float sizeClosingProgress = remap(life, 0.1, uLife, 1.0, 0.0);

    float scalingProgress = min(sizeOpeningProgress, sizeClosingProgress);
    scalingProgress = clamp(scalingProgress, 0.0, 1.0);


    // newPosition.xz += smoothstep(0.0,life, aTimeMultiplier ); 
    // newPosition.x += aTimeMultiplier; 
    // newPosition.z += aTimeMultiplier; 



    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;


    gl_PointSize = uSize * aSize * uResolution.y * scalingProgress ;
    gl_PointSize *= 1.0 / - viewPosition.z;   

    //varying
   //  vSmokeProgress = smokeProgress;
 }