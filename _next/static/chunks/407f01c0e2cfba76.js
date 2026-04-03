(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,3226,o=>{"use strict";var e=o.i(37881),a=o.i(80178),t=o.i(71645),r=o.i(573),i=o.i(31967),s=o.i(21449),l=o.i(45426),n=o.i(93344);let f={maxColorCount:10,maxNoiseIterations:8},c=`#version 300 es
precision mediump float;

uniform float u_time;

uniform sampler2D u_noiseTexture;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${f.maxColorCount}];
uniform float u_colorsCount;

uniform float u_thickness;
uniform float u_radius;
uniform float u_innerShape;
uniform float u_noiseScale;
uniform float u_noiseIterations;

in vec2 v_objectUV;

out vec4 fragColor;

${n.declarePI}
${n.textureRandomizerR}
float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomR(i);
  float b = randomR(i + vec2(1.0, 0.0));
  float c = randomR(i + vec2(0.0, 1.0));
  float d = randomR(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}
vec2 fbm(vec2 n0, vec2 n1) {
  vec2 total = vec2(0.0);
  float amplitude = .4;
  for (int i = 0; i < ${f.maxNoiseIterations}; i++) {
    if (i >= int(u_noiseIterations)) break;
    total.x += valueNoise(n0) * amplitude;
    total.y += valueNoise(n1) * amplitude;
    n0 *= 1.99;
    n1 *= 1.99;
    amplitude *= 0.65;
  }
  return total;
}

float getNoise(vec2 uv, vec2 pUv, float t) {
  vec2 pUvLeft = pUv + .03 * t;
  float period = max(abs(u_noiseScale * TWO_PI), 1e-6);
  vec2 pUvRight = vec2(fract(pUv.x / period) * period, pUv.y) + .03 * t;
  vec2 noise = fbm(pUvLeft, pUvRight);
  return mix(noise.y, noise.x, smoothstep(-.25, .25, uv.x));
}

float getRingShape(vec2 uv) {
  float radius = u_radius;
  float thickness = u_thickness;

  float distance = length(uv);
  float ringValue = 1. - smoothstep(radius, radius + thickness, distance);
  ringValue *= smoothstep(radius - pow(u_innerShape, 3.) * thickness, radius, distance);

  return ringValue;
}

void main() {
  vec2 shape_uv = v_objectUV;

  float t = u_time;

  float cycleDuration = 3.;
  float period2 = 2.0 * cycleDuration;
  float localTime1 = fract((0.1 * t + cycleDuration) / period2) * period2;
  float localTime2 = fract((0.1 * t) / period2) * period2;
  float timeBlend = .5 + .5 * sin(.1 * t * PI / cycleDuration - .5 * PI);

  float atg = atan(shape_uv.y, shape_uv.x) + .001;
  float l = length(shape_uv);
  float radialOffset = .5 * l - inversesqrt(max(1e-4, l));
  vec2 polar_uv1 = vec2(atg, localTime1 - radialOffset) * u_noiseScale;
  vec2 polar_uv2 = vec2(atg, localTime2 - radialOffset) * u_noiseScale;
  
  float noise1 = getNoise(shape_uv, polar_uv1, t);
  float noise2 = getNoise(shape_uv, polar_uv2, t);

  float noise = mix(noise1, noise2, timeBlend);

  shape_uv *= (.8 + 1.2 * noise);

  float ringShape = getRingShape(shape_uv);

  float mixer = ringShape * ringShape * (u_colorsCount - 1.);
  int idxLast = int(u_colorsCount) - 1;
  vec4 gradient = u_colors[idxLast];
  gradient.rgb *= gradient.a;
  for (int i = ${f.maxColorCount} - 2; i >= 0; i--) {
    float localT = clamp(mixer - float(idxLast - i - 1), 0., 1.);
    vec4 c = u_colors[i];
    c.rgb *= c.a;
    gradient = mix(gradient, c, localT);
  }

  vec3 color = gradient.rgb * ringShape;
  float opacity = gradient.a * ringShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}
`;var u=o.i(43476);let m={name:"Default",params:{...i.defaultObjectSizing,speed:.5,frame:0,colorBack:"#000000",colors:["#ffffff"],noiseScale:3,noiseIterations:8,radius:.25,thickness:.65,innerShape:.7,scale:.8}},p={name:"Solar",params:{...i.defaultObjectSizing,speed:1,frame:0,colorBack:"#000000",colors:["#ffffff","#ffca0a","#fc6203","#fc620366"],noiseScale:2,noiseIterations:3,radius:.4,thickness:.8,innerShape:4,scale:2,offsetY:1}},d=[m,{name:"Line",params:{...i.defaultObjectSizing,frame:0,colorBack:"#000000",colors:["#4540a4","#1fe8ff"],noiseScale:1.1,noiseIterations:2,radius:.38,thickness:.01,innerShape:.88,speed:4}},p,{name:"Cloud",params:{...i.defaultObjectSizing,frame:0,colorBack:"#81ADEC",colors:["#ffffff"],noiseScale:3,noiseIterations:10,radius:.5,thickness:.65,innerShape:.85,speed:.5,scale:2.5}}],g=(0,t.memo)(function({speed:o=m.params.speed,frame:a=m.params.frame,colorBack:t=m.params.colorBack,colors:r=m.params.colors,noiseScale:n=m.params.noiseScale,thickness:f=m.params.thickness,radius:p=m.params.radius,innerShape:d=m.params.innerShape,noiseIterations:g=m.params.noiseIterations,fit:v=m.params.fit,scale:h=m.params.scale,rotation:_=m.params.rotation,originX:x=m.params.originX,originY:y=m.params.originY,offsetX:b=m.params.offsetX,offsetY:S=m.params.offsetY,worldWidth:C=m.params.worldWidth,worldHeight:w=m.params.worldHeight,...k}){let z={u_colorBack:(0,s.getShaderColorFromString)(t),u_colors:r.map(s.getShaderColorFromString),u_colorsCount:r.length,u_noiseScale:n,u_thickness:f,u_radius:p,u_innerShape:d,u_noiseIterations:g,u_noiseTexture:(0,l.getShaderNoiseTexture)(),u_fit:i.ShaderFitOptions[v],u_scale:h,u_rotation:_,u_offsetX:b,u_offsetY:S,u_originX:x,u_originY:y,u_worldWidth:C,u_worldHeight:w};return(0,u.jsx)(e.ShaderMount,{...k,speed:o,frame:a,fragmentShader:c,uniforms:z})},r.colorPropsAreEqual),v=`#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform vec4 u_colorFront;
uniform vec4 u_colorMid;
uniform vec4 u_colorBack;
uniform float u_brightness;
uniform float u_contrast;

in vec2 v_patternUV;

out vec4 fragColor;

${n.rotation2}

float neuroShape(vec2 uv, float t) {
  vec2 sine_acc = vec2(0.);
  vec2 res = vec2(0.);
  float scale = 8.;

  for (int j = 0; j < 15; j++) {
    uv = rotate(uv, 1.);
    sine_acc = rotate(sine_acc, 1.);
    vec2 layer = uv * scale + float(j) + sine_acc - t;
    sine_acc += sin(layer);
    res += (.5 + .5 * cos(layer)) / scale;
    scale *= (1.2);
  }
  return res.x + res.y;
}

void main() {
  vec2 shape_uv = v_patternUV;
  shape_uv *= .13;

  float t = .5 * u_time;

  float noise = neuroShape(shape_uv, t);

  noise = (1. + u_brightness) * noise * noise;
  noise = pow(noise, .7 + 6. * u_contrast);
  noise = min(1.4, noise);

  float blend = smoothstep(0.7, 1.4, noise);

  vec4 frontC = u_colorFront;
  frontC.rgb *= frontC.a;
  vec4 midC = u_colorMid;
  midC.rgb *= midC.a;
  vec4 blendFront = mix(midC, frontC, blend);

  float safeNoise = max(noise, 0.0);
  vec3 color = blendFront.rgb * safeNoise;
  float opacity = clamp(blendFront.a * safeNoise, 0., 1.);

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}
`,h={name:"Default",params:{...i.defaultPatternSizing,speed:1,frame:0,colorFront:"#ffffff",colorMid:"#47a6ff",colorBack:"#000000",brightness:.05,contrast:.3}},_=[h,{name:"Sensation",params:{...i.defaultPatternSizing,speed:1,frame:0,colorFront:"#00c8ff",colorMid:"#fbff00",colorBack:"#8b42ff",brightness:.19,contrast:.12,scale:3}},{name:"Bloodstream",params:{...i.defaultPatternSizing,speed:1,frame:0,colorFront:"#ff0000",colorMid:"#ff0000",colorBack:"#ffffff",brightness:.24,contrast:.17,scale:.7}},{name:"Ghost",params:{...i.defaultPatternSizing,speed:1,frame:0,colorFront:"#ffffff",colorMid:"#000000",colorBack:"#ffffff",brightness:0,contrast:1,scale:.55}}],x=(0,t.memo)(function({speed:o=h.params.speed,frame:a=h.params.frame,colorFront:t=h.params.colorFront,colorMid:r=h.params.colorMid,colorBack:l=h.params.colorBack,brightness:n=h.params.brightness,contrast:f=h.params.contrast,fit:c=h.params.fit,scale:m=h.params.scale,rotation:p=h.params.rotation,originX:d=h.params.originX,originY:g=h.params.originY,offsetX:_=h.params.offsetX,offsetY:x=h.params.offsetY,worldWidth:y=h.params.worldWidth,worldHeight:b=h.params.worldHeight,...S}){let C={u_colorFront:(0,s.getShaderColorFromString)(t),u_colorMid:(0,s.getShaderColorFromString)(r),u_colorBack:(0,s.getShaderColorFromString)(l),u_brightness:n,u_contrast:f,u_fit:i.ShaderFitOptions[c],u_scale:m,u_rotation:p,u_offsetX:_,u_offsetY:x,u_originX:d,u_originY:g,u_worldWidth:y,u_worldHeight:b};return(0,u.jsx)(e.ShaderMount,{...S,speed:o,frame:a,fragmentShader:v,uniforms:C})},r.colorPropsAreEqual),y={maxColorCount:10},b=`#version 300 es
precision mediump float;

uniform float u_time;

uniform sampler2D u_noiseTexture;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${y.maxColorCount}];
uniform float u_colorsCount;
uniform float u_stepsPerColor;
uniform float u_size;
uniform float u_sizeRange;
uniform float u_spreading;

in vec2 v_patternUV;

out vec4 fragColor;

${n.declarePI}
${n.rotation2}
${n.textureRandomizerR}
${n.textureRandomizerGB}


vec3 voronoiShape(vec2 uv, float time) {
  vec2 i_uv = floor(uv);
  vec2 f_uv = fract(uv);

  float spreading = .25 * clamp(u_spreading, 0., 1.);

  float minDist = 1.;
  vec2 randomizer = vec2(0.);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 tileOffset = vec2(float(x), float(y));
      vec2 rand = randomGB(i_uv + tileOffset);
      vec2 cellCenter = vec2(.5 + 1e-4);
      cellCenter += spreading * cos(time + TWO_PI * rand);
      cellCenter -= .5;
      cellCenter = rotate(cellCenter, randomR(vec2(rand.x, rand.y)) + .1 * time);
      cellCenter += .5;
      float dist = length(tileOffset + cellCenter - f_uv);
      if (dist < minDist) {
        minDist = dist;
        randomizer = rand;
      }
    }
  }

  return vec3(minDist, randomizer);
}

void main() {

  vec2 shape_uv = v_patternUV;
  shape_uv *= 1.5;

  const float firstFrameOffset = -10.;
  float t = u_time + firstFrameOffset;

  vec3 voronoi = voronoiShape(shape_uv, t) + 1e-4;

  float radius = .25 * clamp(u_size, 0., 1.) - .5 * clamp(u_sizeRange, 0., 1.) * voronoi[2];
  float dist = voronoi[0];
  float edgeWidth = fwidth(dist);
  float dots = 1. - smoothstep(radius - edgeWidth, radius + edgeWidth, dist);

  float shape = voronoi[1];

  float mixer = shape * (u_colorsCount - 1.);
  mixer = (shape - .5 / u_colorsCount) * u_colorsCount;
  float steps = max(1., u_stepsPerColor);

  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;
  for (int i = 1; i < ${y.maxColorCount}; i++) {
    if (i >= int(u_colorsCount)) break;
    float localT = clamp(mixer - float(i - 1), 0.0, 1.0);
    localT = round(localT * steps) / steps;
    vec4 c = u_colors[i];
    c.rgb *= c.a;
    gradient = mix(gradient, c, localT);
  }

  if ((mixer < 0.) || (mixer > (u_colorsCount - 1.))) {
    float localT = mixer + 1.;
    if (mixer > (u_colorsCount - 1.)) {
      localT = mixer - (u_colorsCount - 1.);
    }
    localT = round(localT * steps) / steps;
    vec4 cFst = u_colors[0];
    cFst.rgb *= cFst.a;
    vec4 cLast = u_colors[int(u_colorsCount - 1.)];
    cLast.rgb *= cLast.a;
    gradient = mix(cLast, cFst, localT);
  }

  vec3 color = gradient.rgb * dots;
  float opacity = gradient.a * dots;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  fragColor = vec4(color, opacity);
}
`,S={name:"Default",params:{...i.defaultPatternSizing,speed:1.5,frame:0,colorBack:"#000000",colors:["#ffc96b","#ff6200","#ff2f00","#421100","#1a0000"],size:1,sizeRange:0,spreading:1,stepsPerColor:4}},C={name:"Shine",params:{...i.defaultPatternSizing,speed:.1,frame:0,colors:["#ffffff","#006aff","#fff675"],colorBack:"#000000",stepsPerColor:4,size:.3,sizeRange:.2,spreading:1,scale:.4}},w=[S,{name:"Bubbles",params:{...i.defaultPatternSizing,speed:.4,frame:0,colors:["#D0D2D5"],colorBack:"#989CA4",stepsPerColor:2,size:.9,sizeRange:.7,spreading:1,scale:1.64}},C,{name:"Hallucinatory",params:{...i.defaultPatternSizing,speed:5,frame:0,colors:["#000000"],colorBack:"#ffe500",stepsPerColor:2,size:.65,sizeRange:0,spreading:.3,scale:.5}}],k=(0,t.memo)(function({speed:o=S.params.speed,frame:a=S.params.frame,colorBack:t=S.params.colorBack,colors:r=S.params.colors,size:n=S.params.size,sizeRange:f=S.params.sizeRange,spreading:c=S.params.spreading,stepsPerColor:m=S.params.stepsPerColor,fit:p=S.params.fit,scale:d=S.params.scale,rotation:g=S.params.rotation,originX:v=S.params.originX,originY:h=S.params.originY,offsetX:_=S.params.offsetX,offsetY:x=S.params.offsetY,worldWidth:y=S.params.worldWidth,worldHeight:C=S.params.worldHeight,...w}){let k={u_colorBack:(0,s.getShaderColorFromString)(t),u_colors:r.map(s.getShaderColorFromString),u_colorsCount:r.length,u_size:n,u_sizeRange:f,u_spreading:c,u_stepsPerColor:m,u_noiseTexture:(0,l.getShaderNoiseTexture)(),u_fit:i.ShaderFitOptions[p],u_scale:d,u_rotation:g,u_offsetX:_,u_offsetY:x,u_originX:v,u_originY:h,u_worldWidth:y,u_worldHeight:C};return(0,u.jsx)(e.ShaderMount,{...w,speed:o,frame:a,fragmentShader:b,uniforms:k})},r.colorPropsAreEqual),z=`#version 300 es
precision mediump float;

uniform vec4 u_colorBack;
uniform vec4 u_colorFill;
uniform vec4 u_colorStroke;
uniform float u_dotSize;
uniform float u_gapX;
uniform float u_gapY;
uniform float u_strokeWidth;
uniform float u_sizeRange;
uniform float u_opacityRange;
uniform float u_shape;

in vec2 v_patternUV;

out vec4 fragColor;

${n.declarePI}
${n.simplexNoise}

float polygon(vec2 p, float N, float rot) {
  float a = atan(p.x, p.y) + rot;
  float r = TWO_PI / float(N);

  return cos(floor(.5 + a / r) * r - a) * length(p);
}

void main() {

  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  vec2 shape_uv = 100. * v_patternUV;

  vec2 gap = max(abs(vec2(u_gapX, u_gapY)), vec2(1e-6));
  vec2 grid = fract(shape_uv / gap) + 1e-4;
  vec2 grid_idx = floor(shape_uv / gap);
  float sizeRandomizer = .5 + .8 * snoise(2. * vec2(grid_idx.x * 100., grid_idx.y));
  float opacity_randomizer = .5 + .7 * snoise(2. * vec2(grid_idx.y, grid_idx.x));

  vec2 center = vec2(0.5) - 1e-3;
  vec2 p = (grid - center) * vec2(u_gapX, u_gapY);

  float baseSize = u_dotSize * (1. - sizeRandomizer * u_sizeRange);
  float strokeWidth = u_strokeWidth * (1. - sizeRandomizer * u_sizeRange);

  float dist;
  if (u_shape < 0.5) {
    // Circle
    dist = length(p);
  } else if (u_shape < 1.5) {
    // Diamond
    strokeWidth *= 1.5;
    dist = polygon(1.5 * p, 4., .25 * PI);
  } else if (u_shape < 2.5) {
    // Square
    dist = polygon(1.03 * p, 4., 1e-3);
  } else {
    // Triangle
    strokeWidth *= 1.5;
    p = p * 2. - 1.;
    p *= .9;
    p.y = 1. - p.y;
    p.y -= .75 * baseSize;
    dist = polygon(p, 3., 1e-3);
  }

  float edgeWidth = fwidth(dist);
  float shapeOuter = 1. - smoothstep(baseSize - edgeWidth, baseSize + edgeWidth, dist - strokeWidth);
  float shapeInner = 1. - smoothstep(baseSize - edgeWidth, baseSize + edgeWidth, dist);
  float stroke = shapeOuter - shapeInner;

  float dotOpacity = max(0., 1. - opacity_randomizer * u_opacityRange);
  stroke *= dotOpacity;
  shapeInner *= dotOpacity;

  stroke *= u_colorStroke.a;
  shapeInner *= u_colorFill.a;

  vec3 color = vec3(0.);
  color += stroke * u_colorStroke.rgb;
  color += shapeInner * u_colorFill.rgb;
  color += (1. - shapeInner - stroke) * u_colorBack.rgb * u_colorBack.a;

  float opacity = 0.;
  opacity += stroke;
  opacity += shapeInner;
  opacity += (1. - opacity) * u_colorBack.a;

  fragColor = vec4(color, opacity);
}
`,B={circle:0,diamond:1,square:2,triangle:3},O={name:"Default",params:{...i.defaultPatternSizing,colorBack:"#000000",colorFill:"#ffffff",colorStroke:"#ffaa00",size:2,gapX:32,gapY:32,strokeWidth:0,sizeRange:0,opacityRange:0,shape:"circle"}},F=[O,{name:"Triangles",params:{...i.defaultPatternSizing,colorBack:"#ffffff",colorFill:"#ffffff",colorStroke:"#808080",size:5,gapX:32,gapY:32,strokeWidth:1,sizeRange:0,opacityRange:0,shape:"triangle"}},{name:"Tree line",params:{...i.defaultPatternSizing,colorBack:"#f4fce7",colorFill:"#052e19",colorStroke:"#000000",size:8,gapX:20,gapY:90,strokeWidth:0,sizeRange:1,opacityRange:.6,shape:"circle"}},{name:"Wallpaper",params:{...i.defaultPatternSizing,colorBack:"#204030",colorFill:"#000000",colorStroke:"#bd955b",size:9,gapX:32,gapY:32,strokeWidth:1,sizeRange:0,opacityRange:0,shape:"diamond"}}],U=(0,t.memo)(function({colorBack:o=O.params.colorBack,colorFill:a=O.params.colorFill,colorStroke:t=O.params.colorStroke,size:r=O.params.size,gapX:l=O.params.gapX,gapY:n=O.params.gapY,strokeWidth:f=O.params.strokeWidth,sizeRange:c=O.params.sizeRange,opacityRange:m=O.params.opacityRange,shape:p=O.params.shape,fit:d=O.params.fit,scale:g=O.params.scale,rotation:v=O.params.rotation,originX:h=O.params.originX,originY:_=O.params.originY,offsetX:x=O.params.offsetX,offsetY:y=O.params.offsetY,worldWidth:b=O.params.worldWidth,worldHeight:S=O.params.worldHeight,maxPixelCount:C=0x136a400,...w}){let k={u_colorBack:(0,s.getShaderColorFromString)(o),u_colorFill:(0,s.getShaderColorFromString)(a),u_colorStroke:(0,s.getShaderColorFromString)(t),u_dotSize:r,u_gapX:l,u_gapY:n,u_strokeWidth:f,u_sizeRange:c,u_opacityRange:m,u_shape:B[p],u_fit:i.ShaderFitOptions[d],u_scale:g,u_rotation:v,u_offsetX:x,u_offsetY:y,u_originX:h,u_originY:_,u_worldWidth:b,u_worldHeight:S};return(0,u.jsx)(e.ShaderMount,{...w,maxPixelCount:C,fragmentShader:z,uniforms:k})},r.colorPropsAreEqual),V={maxColorCount:10},R=`#version 300 es
precision mediump float;

uniform float u_time;
uniform float u_scale;

uniform vec4 u_colors[${V.maxColorCount}];
uniform float u_colorsCount;
uniform float u_stepsPerColor;
uniform float u_softness;

in vec2 v_patternUV;

out vec4 fragColor;

${n.simplexNoise}

float getNoise(vec2 uv, float t) {
  float noise = .5 * snoise(uv - vec2(0., .3 * t));
  noise += .5 * snoise(2. * uv + vec2(0., .32 * t));

  return noise;
}

float steppedSmooth(float m, float steps, float softness) {
  float stepT = floor(m * steps) / steps;
  float f = m * steps - floor(m * steps);
  float fw = steps * fwidth(m);
  float smoothed = smoothstep(.5 - softness, min(1., .5 + softness + fw), f);
  return stepT + smoothed / steps;
}

void main() {
  vec2 shape_uv = v_patternUV;
  shape_uv *= .1;

  float t = .2 * u_time;

  float shape = .5 + .5 * getNoise(shape_uv, t);

  bool u_extraSides = true;

  float mixer = shape * (u_colorsCount - 1.);
  if (u_extraSides == true) {
    mixer = (shape - .5 / u_colorsCount) * u_colorsCount;
  }

  float steps = max(1., u_stepsPerColor);

  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;
  for (int i = 1; i < ${V.maxColorCount}; i++) {
    if (i >= int(u_colorsCount)) break;

    float localM = clamp(mixer - float(i - 1), 0., 1.);
    localM = steppedSmooth(localM, steps, .5 * u_softness);

    vec4 c = u_colors[i];
    c.rgb *= c.a;
    gradient = mix(gradient, c, localM);
  }

  if (u_extraSides == true) {
    if ((mixer < 0.) || (mixer > (u_colorsCount - 1.))) {
      float localM = mixer + 1.;
      if (mixer > (u_colorsCount - 1.)) {
        localM = mixer - (u_colorsCount - 1.);
      }
      localM = steppedSmooth(localM, steps, .5 * u_softness);
      vec4 cFst = u_colors[0];
      cFst.rgb *= cFst.a;
      vec4 cLast = u_colors[int(u_colorsCount - 1.)];
      cLast.rgb *= cLast.a;
      gradient = mix(cLast, cFst, localM);
    }
  }

  vec3 color = gradient.rgb;
  float opacity = gradient.a;

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}
`,M={name:"Default",params:{...i.defaultPatternSizing,scale:.6,speed:.5,frame:0,colors:["#4449CF","#FFD1E0","#F94446","#FFD36B","#FFFFFF"],stepsPerColor:2,softness:0}},P={name:"Bubblegum",params:{...i.defaultPatternSizing,speed:2,frame:0,colors:["#ffffff","#ff9e9e","#5f57ff","#00f7ff"],stepsPerColor:1,softness:1,scale:1.6}},Y=[M,{name:"Spots",params:{...i.defaultPatternSizing,speed:.6,frame:0,colors:["#ff7b00","#f9ffeb","#320d82"],stepsPerColor:1,softness:0,scale:1}},{name:"First contact",params:{...i.defaultPatternSizing,speed:2,frame:0,colors:["#e8cce6","#120d22","#442c44","#e6baba","#fff5f5"],stepsPerColor:2,softness:0,scale:.2}},P],I=(0,t.memo)(function({speed:o=M.params.speed,frame:a=M.params.frame,colors:t=M.params.colors,stepsPerColor:r=M.params.stepsPerColor,softness:l=M.params.softness,fit:n=M.params.fit,scale:f=M.params.scale,rotation:c=M.params.rotation,originX:m=M.params.originX,originY:p=M.params.originY,offsetX:d=M.params.offsetX,offsetY:g=M.params.offsetY,worldWidth:v=M.params.worldWidth,worldHeight:h=M.params.worldHeight,..._}){let x={u_colors:t.map(s.getShaderColorFromString),u_colorsCount:t.length,u_stepsPerColor:r,u_softness:l,u_fit:i.ShaderFitOptions[n],u_scale:f,u_rotation:c,u_offsetX:d,u_offsetY:g,u_originX:m,u_originY:p,u_worldWidth:v,u_worldHeight:h};return(0,u.jsx)(e.ShaderMount,{..._,speed:o,frame:a,fragmentShader:R,uniforms:x})},r.colorPropsAreEqual),A={maxColorCount:8,maxBallsCount:20},N=`#version 300 es
precision mediump float;

uniform float u_time;

uniform sampler2D u_noiseTexture;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${A.maxColorCount}];
uniform float u_colorsCount;
uniform float u_size;
uniform float u_sizeRange;
uniform float u_count;

in vec2 v_objectUV;

out vec4 fragColor;

${n.declarePI}
${n.textureRandomizerR}
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  vec2 p0 = vec2(i, 0.0);
  vec2 p1 = vec2(i + 1.0, 0.0);
  return mix(randomR(p0), randomR(p1), u);
}

float getBallShape(vec2 uv, vec2 c, float p) {
  float s = .5 * length(uv - c);
  s = 1. - clamp(s, 0., 1.);
  s = pow(s, p);
  return s;
}

void main() {
  vec2 shape_uv = v_objectUV;

  shape_uv += .5;

  const float firstFrameOffset = 2503.4;
  float t = .2 * (u_time + firstFrameOffset);

  vec3 totalColor = vec3(0.);
  float totalShape = 0.;
  float totalOpacity = 0.;

  for (int i = 0; i < ${A.maxBallsCount}; i++) {
    if (i >= int(ceil(u_count))) break;

    float idxFract = float(i) / float(${A.maxBallsCount});
    float angle = TWO_PI * idxFract;

    float speed = 1. - .2 * idxFract;
    float noiseX = noise(angle * 10. + float(i) + t * speed);
    float noiseY = noise(angle * 20. + float(i) - t * speed);

    vec2 pos = vec2(.5) + 1e-4 + .9 * (vec2(noiseX, noiseY) - .5);

    int safeIndex = i % int(u_colorsCount + 0.5);
    vec4 ballColor = u_colors[safeIndex];
    ballColor.rgb *= ballColor.a;

    float sizeFrac = 1.;
    if (float(i) > floor(u_count - 1.)) {
      sizeFrac *= fract(u_count);
    }

    float shape = getBallShape(shape_uv, pos, 45. - 30. * u_size * sizeFrac);
    shape *= pow(u_size, .2);
    shape = smoothstep(0., 1., shape);

    totalColor += ballColor.rgb * shape;
    totalShape += shape;
    totalOpacity += ballColor.a * shape;
  }

  totalColor /= max(totalShape, 1e-4);
  totalOpacity /= max(totalShape, 1e-4);

  float edge_width = fwidth(totalShape);
  float finalShape = smoothstep(.4, .4 + edge_width, totalShape);

  vec3 color = totalColor * finalShape;
  float opacity = totalOpacity * finalShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}
`,X={name:"Default",params:{...i.defaultObjectSizing,scale:1,speed:1,frame:0,colorBack:"#000000",colors:["#6e33cc","#ff5500","#ffc105","#ffc800","#f585ff"],count:10,size:.83}},T={name:"Ink Drops",params:{...i.defaultObjectSizing,scale:1,speed:2,frame:0,colorBack:"#ffffff00",colors:["#000000"],count:18,size:.1}},W={name:"Background",params:{...i.defaultObjectSizing,speed:.5,frame:0,colors:["#ae00ff","#00ff95","#ffc105"],colorBack:"#2a273f",count:13,size:.81,scale:4,rotation:0,offsetX:-.3}},j=[X,T,{name:"Solar",params:{...i.defaultObjectSizing,speed:1,frame:0,colors:["#ffc800","#ff5500","#ffc105"],colorBack:"#102f84",count:7,size:.75,scale:1}},W],D=(0,t.memo)(function({speed:o=X.params.speed,frame:a=X.params.frame,colorBack:t=X.params.colorBack,colors:r=X.params.colors,size:n=X.params.size,count:f=X.params.count,fit:c=X.params.fit,rotation:m=X.params.rotation,scale:p=X.params.scale,originX:d=X.params.originX,originY:g=X.params.originY,offsetX:v=X.params.offsetX,offsetY:h=X.params.offsetY,worldWidth:_=X.params.worldWidth,worldHeight:x=X.params.worldHeight,...y}){let b={u_colorBack:(0,s.getShaderColorFromString)(t),u_colors:r.map(s.getShaderColorFromString),u_colorsCount:r.length,u_size:n,u_count:f,u_noiseTexture:(0,l.getShaderNoiseTexture)(),u_fit:i.ShaderFitOptions[c],u_rotation:m,u_scale:p,u_offsetX:v,u_offsetY:h,u_originX:d,u_originY:g,u_worldWidth:_,u_worldHeight:x};return(0,u.jsx)(e.ShaderMount,{...y,speed:o,frame:a,fragmentShader:N,uniforms:b})},r.colorPropsAreEqual),G=`#version 300 es
precision mediump float;

uniform vec4 u_colorFront;
uniform vec4 u_colorBack;
uniform float u_shape;
uniform float u_frequency;
uniform float u_amplitude;
uniform float u_spacing;
uniform float u_proportion;
uniform float u_softness;

in vec2 v_patternUV;

out vec4 fragColor;

${n.declarePI}

void main() {
  vec2 shape_uv = v_patternUV;
  shape_uv *= 4.;

  float wave = .5 * cos(shape_uv.x * u_frequency * TWO_PI);
  float zigzag = 2. * abs(fract(shape_uv.x * u_frequency) - .5);
  float irregular = sin(shape_uv.x * .25 * u_frequency * TWO_PI) * cos(shape_uv.x * u_frequency * TWO_PI);
  float irregular2 = .75 * (sin(shape_uv.x * u_frequency * TWO_PI) + .5 * cos(shape_uv.x * .5 * u_frequency * TWO_PI));

  float offset = mix(zigzag, wave, smoothstep(0., 1., u_shape));
  offset = mix(offset, irregular, smoothstep(1., 2., u_shape));
  offset = mix(offset, irregular2, smoothstep(2., 3., u_shape));
  offset *= 2. * u_amplitude;

  float spacing = (.001 + u_spacing);
  float shape = .5 + .5 * sin((shape_uv.y + offset) * PI / spacing);

  float aa = .0001 + fwidth(shape);
  float dc = 1. - clamp(u_proportion, 0., 1.);
  float e0 = dc - u_softness - aa;
  float e1 = dc + u_softness + aa;
  float res = smoothstep(min(e0, e1), max(e0, e1), shape);

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;

  color += bgColor * (1. - opacity);
  opacity += bgOpacity * (1. - opacity);

  fragColor = vec4(color, opacity);
}
`,H={name:"Default",params:{...i.defaultPatternSizing,scale:.6,colorFront:"#ffbb00",colorBack:"#000000",shape:0,frequency:.5,amplitude:.5,spacing:1.2,proportion:.1,softness:0}},q=[H,{name:"Groovy",params:{...i.defaultPatternSizing,scale:5,rotation:90,colorFront:"#fcfcee",colorBack:"#ff896b",shape:3,frequency:.2,amplitude:.25,spacing:1.17,proportion:.57,softness:0}},{name:"Tangled up",params:{...i.defaultPatternSizing,scale:.5,rotation:0,colorFront:"#133a41",colorBack:"#c2d8b6",shape:2.07,frequency:.44,amplitude:.57,spacing:1.05,proportion:.75,softness:0}},{name:"Ride the wave",params:{...i.defaultPatternSizing,scale:1.7,rotation:0,colorFront:"#fdffe6",colorBack:"#1f1f1f",shape:2.25,frequency:.2,amplitude:1,spacing:1.25,proportion:1,softness:0}}],$=(0,t.memo)(function({colorFront:o=H.params.colorFront,colorBack:a=H.params.colorBack,shape:t=H.params.shape,frequency:r=H.params.frequency,amplitude:l=H.params.amplitude,spacing:n=H.params.spacing,proportion:f=H.params.proportion,softness:c=H.params.softness,fit:m=H.params.fit,scale:p=H.params.scale,rotation:d=H.params.rotation,offsetX:g=H.params.offsetX,offsetY:v=H.params.offsetY,originX:h=H.params.originX,originY:_=H.params.originY,worldWidth:x=H.params.worldWidth,worldHeight:y=H.params.worldHeight,maxPixelCount:b=0x136a400,...S}){let C={u_colorFront:(0,s.getShaderColorFromString)(o),u_colorBack:(0,s.getShaderColorFromString)(a),u_shape:t,u_frequency:r,u_amplitude:l,u_spacing:n,u_proportion:f,u_softness:c,u_fit:i.ShaderFitOptions[m],u_scale:p,u_rotation:d,u_offsetX:g,u_offsetY:v,u_originX:h,u_originY:_,u_worldWidth:x,u_worldHeight:y};return(0,u.jsx)(e.ShaderMount,{...S,fragmentShader:G,uniforms:C})},r.colorPropsAreEqual),L=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colorFront;
uniform vec4 u_colorBack;
uniform float u_proportion;
uniform float u_softness;
uniform float u_octaveCount;
uniform float u_persistence;
uniform float u_lacunarity;

in vec2 v_patternUV;

out vec4 fragColor;

${n.declarePI}
${n.proceduralHash11}
${n.proceduralHash21}

float hash31(vec3 p) {
  p = fract(p * 0.3183099) + 0.1;
  p += dot(p, p.yzx + 19.19);
  return fract(p.x * (p.y + p.z));
}

vec3 gradientPredefined(float hash) {
  int idx = int(hash * 12.0) % 12;

  if (idx == 0) return vec3(1, 1, 0);
  if (idx == 1) return vec3(-1, 1, 0);
  if (idx == 2) return vec3(1, -1, 0);
  if (idx == 3) return vec3(-1, -1, 0);
  if (idx == 4) return vec3(1, 0, 1);
  if (idx == 5) return vec3(-1, 0, 1);
  if (idx == 6) return vec3(1, 0, -1);
  if (idx == 7) return vec3(-1, 0, -1);
  if (idx == 8) return vec3(0, 1, 1);
  if (idx == 9) return vec3(0, -1, 1);
  if (idx == 10) return vec3(0, 1, -1);
  return vec3(0, -1, -1);// idx == 11
}

float interpolateSafe(float v000, float v001, float v010, float v011,
float v100, float v101, float v110, float v111, vec3 t) {
  t = clamp(t, 0.0, 1.0);

  float v00 = mix(v000, v100, t.x);
  float v01 = mix(v001, v101, t.x);
  float v10 = mix(v010, v110, t.x);
  float v11 = mix(v011, v111, t.x);

  float v0 = mix(v00, v10, t.y);
  float v1 = mix(v01, v11, t.y);

  return mix(v0, v1, t.z);
}

vec3 fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float perlinNoise(vec3 position, float seed) {
  position += vec3(seed * 127.1, seed * 311.7, seed * 74.7);

  vec3 i = floor(position);
  vec3 f = fract(position);
  float h000 = hash31(i);
  float h001 = hash31(i + vec3(0, 0, 1));
  float h010 = hash31(i + vec3(0, 1, 0));
  float h011 = hash31(i + vec3(0, 1, 1));
  float h100 = hash31(i + vec3(1, 0, 0));
  float h101 = hash31(i + vec3(1, 0, 1));
  float h110 = hash31(i + vec3(1, 1, 0));
  float h111 = hash31(i + vec3(1, 1, 1));
  vec3 g000 = gradientPredefined(h000);
  vec3 g001 = gradientPredefined(h001);
  vec3 g010 = gradientPredefined(h010);
  vec3 g011 = gradientPredefined(h011);
  vec3 g100 = gradientPredefined(h100);
  vec3 g101 = gradientPredefined(h101);
  vec3 g110 = gradientPredefined(h110);
  vec3 g111 = gradientPredefined(h111);
  float v000 = dot(g000, f - vec3(0, 0, 0));
  float v001 = dot(g001, f - vec3(0, 0, 1));
  float v010 = dot(g010, f - vec3(0, 1, 0));
  float v011 = dot(g011, f - vec3(0, 1, 1));
  float v100 = dot(g100, f - vec3(1, 0, 0));
  float v101 = dot(g101, f - vec3(1, 0, 1));
  float v110 = dot(g110, f - vec3(1, 1, 0));
  float v111 = dot(g111, f - vec3(1, 1, 1));

  vec3 u = fade(f);
  return interpolateSafe(v000, v001, v010, v011, v100, v101, v110, v111, u);
}

float p_noise(vec3 position, int octaveCount, float persistence, float lacunarity) {
  float value = 0.0;
  float amplitude = 1.0;
  float frequency = 10.0;
  float maxValue = 0.0;
  octaveCount = clamp(octaveCount, 1, 8);

  for (int i = 0; i < octaveCount; i++) {
    float seed = float(i) * 0.7319;
    value += perlinNoise(position * frequency, seed) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return value;
}

float get_max_amp(float persistence, float octaveCount) {
  persistence = clamp(persistence * 0.999, 0.0, 0.999);
  octaveCount = clamp(octaveCount, 1.0, 8.0);

  if (abs(persistence - 1.0) < 0.001) {
    return octaveCount;
  }

  return (1.0 - pow(persistence, octaveCount)) / max(1e-4, (1.0 - persistence));
}

void main() {
  vec2 uv = v_patternUV;
  uv *= .5;

  float t = .2 * u_time;

  vec3 p = vec3(uv, t);

  float octCount = floor(u_octaveCount);
  float noise = p_noise(p, int(octCount), u_persistence, u_lacunarity);

  float max_amp = get_max_amp(u_persistence, octCount);
  float noise_normalized = clamp((noise + max_amp) / max(1e-4, (2. * max_amp)) + (u_proportion - .5), 0.0, 1.0);
  float sharpness = clamp(u_softness, 0., 1.);
  float smooth_w = 0.5 * max(fwidth(noise_normalized), 0.001);
  float res = smoothstep(
  .5 - .5 * sharpness - smooth_w,
  .5 + .5 * sharpness + smooth_w,
  noise_normalized
  );

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;

  color += bgColor * (1. - opacity);
  opacity += bgOpacity * (1. - opacity);

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}
`,E={name:"Default",params:{...i.defaultPatternSizing,speed:.5,frame:0,colorBack:"#632ad5",colorFront:"#fccff7",proportion:.35,softness:.1,octaveCount:1,persistence:1,lacunarity:1.5}},K=[E,{name:"Nintendo Water",params:{...i.defaultPatternSizing,scale:5,speed:.4,frame:0,colorBack:"#2d69d4",colorFront:"#d1eefc",proportion:.42,softness:0,octaveCount:2,persistence:.55,lacunarity:1.8}},{name:"Moss",params:{...i.defaultPatternSizing,scale:1/.15,speed:.02,frame:0,colorBack:"#05ff4a",colorFront:"#262626",proportion:.65,softness:.35,octaveCount:6,persistence:1,lacunarity:2.55}},{name:"Worms",params:{...i.defaultPatternSizing,scale:.9,speed:0,frame:0,colorBack:"#ffffff00",colorFront:"#595959",proportion:.5,softness:0,octaveCount:1,persistence:1,lacunarity:1.5}}],J=(0,t.memo)(function({speed:o=E.params.speed,frame:a=E.params.frame,colorFront:t=E.params.colorFront,colorBack:r=E.params.colorBack,proportion:l=E.params.proportion,softness:n=E.params.softness,octaveCount:f=E.params.octaveCount,persistence:c=E.params.persistence,lacunarity:m,fit:p=E.params.fit,worldWidth:d=E.params.worldWidth,worldHeight:g=E.params.worldHeight,scale:v=E.params.scale,rotation:h=E.params.rotation,originX:_=E.params.originX,originY:x=E.params.originY,offsetX:y=E.params.offsetX,offsetY:b=E.params.offsetY,...S}){let C={u_colorBack:(0,s.getShaderColorFromString)(r),u_colorFront:(0,s.getShaderColorFromString)(t),u_proportion:l,u_softness:n??E.params.softness,u_octaveCount:f??E.params.octaveCount,u_persistence:c??E.params.persistence,u_lacunarity:m??E.params.lacunarity,u_fit:i.ShaderFitOptions[p],u_scale:v,u_rotation:h,u_offsetX:y,u_offsetY:b,u_originX:_,u_originY:x,u_worldWidth:d,u_worldHeight:g};return(0,u.jsx)(e.ShaderMount,{...S,speed:o,frame:a,fragmentShader:L,uniforms:C})},r.colorPropsAreEqual),Q={maxColorCount:5},Z=`#version 300 es
precision mediump float;

uniform float u_time;

uniform float u_scale;

uniform sampler2D u_noiseTexture;

uniform vec4 u_colors[${Q.maxColorCount}];
uniform float u_colorsCount;

uniform float u_stepsPerColor;
uniform vec4 u_colorGlow;
uniform vec4 u_colorGap;
uniform float u_distortion;
uniform float u_gap;
uniform float u_glow;

in vec2 v_patternUV;

out vec4 fragColor;

${n.declarePI}
${n.textureRandomizerGB}

vec4 voronoi(vec2 x, float t) {
  vec2 ip = floor(x);
  vec2 fp = fract(x);

  vec2 mg, mr;
  float md = 8.;
  float rand = 0.;

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = randomGB(ip + g);
      float raw_hash = o.x;
      o = .5 + u_distortion * sin(t + TWO_PI * o);
      vec2 r = g + o - fp;
      float d = dot(r, r);

      if (d < md) {
        md = d;
        mr = r;
        mg = g;
        rand = raw_hash;
      }
    }
  }

  md = 8.;
  for (int j = -2; j <= 2; j++) {
    for (int i = -2; i <= 2; i++) {
      vec2 g = mg + vec2(float(i), float(j));
      vec2 o = randomGB(ip + g);
      o = .5 + u_distortion * sin(t + TWO_PI * o);
      vec2 r = g + o - fp;
      if (dot(mr - r, mr - r) > .00001) {
        md = min(md, dot(.5 * (mr + r), normalize(r - mr)));
      }
    }
  }

  return vec4(md, mr, rand);
}

void main() {
  vec2 shape_uv = v_patternUV;
  shape_uv *= 1.25;

  float t = u_time;

  vec4 voronoiRes = voronoi(shape_uv, t);

  float shape = clamp(voronoiRes.w, 0., 1.);
  float mixer = shape * (u_colorsCount - 1.);
  mixer = (shape - .5 / u_colorsCount) * u_colorsCount;
  float steps = max(1., u_stepsPerColor);

  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;
  for (int i = 1; i < ${Q.maxColorCount}; i++) {
    if (i >= int(u_colorsCount)) break;
    float localT = clamp(mixer - float(i - 1), 0.0, 1.0);
    localT = round(localT * steps) / steps;
    vec4 c = u_colors[i];
    c.rgb *= c.a;
    gradient = mix(gradient, c, localT);
  }

  if ((mixer < 0.) || (mixer > (u_colorsCount - 1.))) {
    float localT = mixer + 1.;
    if (mixer > (u_colorsCount - 1.)) {
      localT = mixer - (u_colorsCount - 1.);
    }
    localT = round(localT * steps) / steps;
    vec4 cFst = u_colors[0];
    cFst.rgb *= cFst.a;
    vec4 cLast = u_colors[int(u_colorsCount - 1.)];
    cLast.rgb *= cLast.a;
    gradient = mix(cLast, cFst, localT);
  }

  vec3 cellColor = gradient.rgb;
  float cellOpacity = gradient.a;

  float glows = length(voronoiRes.yz * u_glow);
  glows = pow(glows, 1.5);

  vec3 color = mix(cellColor, u_colorGlow.rgb * u_colorGlow.a, u_colorGlow.a * glows);
  float opacity = cellOpacity + u_colorGlow.a * glows;

  float edge = voronoiRes.x;
  float smoothEdge = .02 / (2. * u_scale) * (1. + .5 * u_gap);
  edge = smoothstep(u_gap - smoothEdge, u_gap + smoothEdge, edge);

  color = mix(u_colorGap.rgb * u_colorGap.a, color, edge);
  opacity = mix(u_colorGap.a, opacity, edge);

  fragColor = vec4(color, opacity);
}
`,oo={name:"Default",params:{...i.defaultPatternSizing,speed:.5,frame:0,colors:["#ff8247","#ffe53d"],stepsPerColor:3,colorGlow:"#ffffff",colorGap:"#2e0000",distortion:.4,gap:.04,glow:0,scale:.5}},oe={name:"Cells",params:{...i.defaultPatternSizing,scale:.5,speed:.5,frame:0,colors:["#ffffff"],stepsPerColor:1,colorGlow:"#ffffff",colorGap:"#000000",distortion:.5,gap:.03,glow:.8}},oa={name:"Bubbles",params:{...i.defaultPatternSizing,scale:.75,speed:.5,frame:0,colors:["#83c9fb"],stepsPerColor:1,colorGlow:"#ffffff",colorGap:"#ffffff",distortion:.4,gap:0,glow:1}},ot=[oo,{name:"Lights",params:{...i.defaultPatternSizing,scale:3.3,speed:.5,frame:0,colors:["#fffffffc","#bbff00","#00ffff"],colorGlow:"#ff00d0",colorGap:"#ff00d0",stepsPerColor:2,distortion:.38,gap:0,glow:1}},oe,oa],or=(0,t.memo)(function({speed:o=oo.params.speed,frame:a=oo.params.frame,colors:t=oo.params.colors,stepsPerColor:r=oo.params.stepsPerColor,colorGlow:n=oo.params.colorGlow,colorGap:f=oo.params.colorGap,distortion:c=oo.params.distortion,gap:m=oo.params.gap,glow:p=oo.params.glow,fit:d=oo.params.fit,scale:g=oo.params.scale,rotation:v=oo.params.rotation,originX:h=oo.params.originX,originY:_=oo.params.originY,offsetX:x=oo.params.offsetX,offsetY:y=oo.params.offsetY,worldWidth:b=oo.params.worldWidth,worldHeight:S=oo.params.worldHeight,...C}){let w={u_colors:t.map(s.getShaderColorFromString),u_colorsCount:t.length,u_stepsPerColor:r,u_colorGlow:(0,s.getShaderColorFromString)(n),u_colorGap:(0,s.getShaderColorFromString)(f),u_distortion:c,u_gap:m,u_glow:p,u_noiseTexture:(0,l.getShaderNoiseTexture)(),u_fit:i.ShaderFitOptions[d],u_scale:g,u_rotation:v,u_offsetX:x,u_offsetY:y,u_originX:h,u_originY:_,u_worldWidth:b,u_worldHeight:S};return(0,u.jsx)(e.ShaderMount,{...C,speed:o,frame:a,fragmentShader:Z,uniforms:w})},r.colorPropsAreEqual),oi={maxColorCount:10},os=`#version 300 es
precision mediump float;

uniform float u_time;
uniform float u_scale;

uniform sampler2D u_noiseTexture;

uniform vec4 u_colors[${oi.maxColorCount}];
uniform float u_colorsCount;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

in vec2 v_patternUV;

out vec4 fragColor;

${n.declarePI}
${n.rotation2}
float randomG(vec2 p) {
  vec2 uv = floor(p) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).g;
}
float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomG(i);
  float b = randomG(i + vec2(1.0, 0.0));
  float c = randomG(i + vec2(0.0, 1.0));
  float d = randomG(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}


void main() {
  vec2 uv = v_patternUV;
  uv *= .5;

  const float firstFrameOffset = 118.;
  float t = 0.0625 * (u_time + firstFrameOffset);

  float n1 = valueNoise(uv * 1. + t);
  float n2 = valueNoise(uv * 2. - t);
  float angle = n1 * TWO_PI;
  uv.x += 4. * u_distortion * n2 * cos(angle);
  uv.y += 4. * u_distortion * n2 * sin(angle);

  float swirl = u_swirl;
  for (int i = 1; i <= 20; i++) {
    if (i >= int(u_swirlIterations)) break;
    float iFloat = float(i);
    //    swirl *= (1. - smoothstep(.0, .25, length(fwidth(uv))));
    uv.x += swirl / iFloat * cos(t + iFloat * 1.5 * uv.y);
    uv.y += swirl / iFloat * cos(t + iFloat * 1. * uv.x);
  }

  float proportion = clamp(u_proportion, 0., 1.);

  float shape = 0.;
  if (u_shape < .5) {
    vec2 checksShape_uv = uv * (.5 + 3.5 * u_shapeScale);
    shape = .5 + .5 * sin(checksShape_uv.x) * cos(checksShape_uv.y);
    shape += .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else if (u_shape < 1.5) {
    vec2 stripesShape_uv = uv * (2. * u_shapeScale);
    float f = fract(stripesShape_uv.y);
    shape = smoothstep(.0, .55, f) * (1.0 - smoothstep(.45, 1., f));
    shape += .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else {
    float shapeScaling = 5. * (1. - u_shapeScale);
    float e0 = 0.45 - shapeScaling;
    float e1 = 0.55 + shapeScaling;
    shape = smoothstep(min(e0, e1), max(e0, e1), 1.0 - uv.y + 0.3 * (proportion - 0.5));
  }

  float mixer = shape * (u_colorsCount - 1.);
  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;
  float aa = fwidth(shape);
  for (int i = 1; i < ${oi.maxColorCount}; i++) {
    if (i >= int(u_colorsCount)) break;
    float m = clamp(mixer - float(i - 1), 0.0, 1.0);

    float localMixerStart = floor(m);
    float softness = .5 * u_softness + fwidth(m);
    float smoothed = smoothstep(max(0., .5 - softness - aa), min(1., .5 + softness + aa), m - localMixerStart);
    float stepped = localMixerStart + smoothed;

    m = mix(stepped, m, u_softness);

    vec4 c = u_colors[i];
    c.rgb *= c.a;
    gradient = mix(gradient, c, m);
  }

  vec3 color = gradient.rgb;
  float opacity = gradient.a;

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}
`,ol={checks:0,stripes:1,edge:2},on={name:"Default",params:{...i.defaultPatternSizing,rotation:0,speed:1,frame:0,colors:["#121212","#9470ff","#121212","#8838ff"],proportion:.45,softness:1,distortion:.25,swirl:.8,swirlIterations:10,shapeScale:.1,shape:"checks"}},of=[on,{name:"Cauldron Pot",params:{...i.defaultPatternSizing,scale:.9,rotation:160,speed:10,frame:0,colors:["#a7e58b","#324472","#0a180d"],proportion:.64,softness:1.5,distortion:.2,swirl:.86,swirlIterations:7,shapeScale:.6,shape:"edge"}},{name:"Live Ink",params:{...i.defaultPatternSizing,scale:1.2,rotation:44,offsetY:-.3,speed:2.5,frame:0,colors:["#111314","#9faeab","#f3fee7","#f3fee7"],proportion:.05,softness:0,distortion:.25,swirl:.8,swirlIterations:10,shapeScale:.28,shape:"checks"}},{name:"Kelp",params:{...i.defaultPatternSizing,scale:.8,rotation:50,speed:20,frame:0,colors:["#dbff8f","#404f3e","#091316"],proportion:.67,softness:0,distortion:0,swirl:.2,swirlIterations:3,shapeScale:1,shape:"stripes"}},{name:"Nectar",params:{...i.defaultPatternSizing,scale:2,offsetY:.6,rotation:0,speed:4.2,frame:0,colors:["#151310","#d3a86b","#f0edea"],proportion:.24,softness:1,distortion:.21,swirl:.57,swirlIterations:10,shapeScale:.75,shape:"edge"}},{name:"Passion",params:{...i.defaultPatternSizing,scale:2.5,rotation:1.35,speed:3,frame:0,colors:["#3b1515","#954751","#ffc085"],proportion:.5,softness:1,distortion:.09,swirl:.9,swirlIterations:6,shapeScale:.25,shape:"checks"}}],oc=(0,t.memo)(function({speed:o=on.params.speed,frame:a=on.params.frame,colors:t=on.params.colors,proportion:r=on.params.proportion,softness:n=on.params.softness,distortion:f=on.params.distortion,swirl:c=on.params.swirl,swirlIterations:m=on.params.swirlIterations,shapeScale:p=on.params.shapeScale,shape:d=on.params.shape,fit:g=on.params.fit,scale:v=on.params.scale,rotation:h=on.params.rotation,originX:_=on.params.originX,originY:x=on.params.originY,offsetX:y=on.params.offsetX,offsetY:b=on.params.offsetY,worldWidth:S=on.params.worldWidth,worldHeight:C=on.params.worldHeight,...w}){let k={u_colors:t.map(s.getShaderColorFromString),u_colorsCount:t.length,u_proportion:r,u_softness:n,u_distortion:f,u_swirl:c,u_swirlIterations:m,u_shapeScale:p,u_shape:ol[d],u_noiseTexture:(0,l.getShaderNoiseTexture)(),u_scale:v,u_rotation:h,u_fit:i.ShaderFitOptions[g],u_offsetX:y,u_offsetY:b,u_originX:_,u_originY:x,u_worldWidth:S,u_worldHeight:C};return(0,u.jsx)(e.ShaderMount,{...w,speed:o,frame:a,fragmentShader:os,uniforms:k})},r.colorPropsAreEqual);var ou=o.i(8952);let om=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_density;
uniform float u_distortion;
uniform float u_strokeWidth;
uniform float u_strokeCap;
uniform float u_strokeTaper;
uniform float u_noise;
uniform float u_noiseFrequency;
uniform float u_softness;

in vec2 v_patternUV;

out vec4 fragColor;

${n.declarePI}
${n.simplexNoise}

void main() {
  vec2 uv = 2. * v_patternUV;

  float t = u_time;
  float l = length(uv);
  float density = clamp(u_density, 0., 1.);
  l = pow(max(l, 1e-6), density);
  float angle = atan(uv.y, uv.x) - t;
  float angleNormalised = angle / TWO_PI;

  angleNormalised += .125 * u_noise * snoise(16. * pow(u_noiseFrequency, 3.) * uv);

  float offset = l + angleNormalised;
  offset -= u_distortion * (sin(4. * l - .5 * t) * cos(PI + l + .5 * t));
  float stripe = fract(offset);

  float shape = 2. * abs(stripe - .5);
  float width = 1. - clamp(u_strokeWidth, .005 * u_strokeTaper, 1.);


  float wCap = mix(width, (1. - stripe) * (1. - step(.5, stripe)), (1. - clamp(l, 0., 1.)));
  width = mix(width, wCap, u_strokeCap);
  width *= (1. - clamp(u_strokeTaper, 0., 1.) * l);

  float fw = fwidth(offset);
  float fwMult = 4. - 3. * (smoothstep(.05, .4, 2. * u_strokeWidth) * smoothstep(.05, .4, 2. * (1. - u_strokeWidth)));
  float pixelSize = mix(fwMult * fw, fwidth(shape), clamp(fw, 0., 1.));
  pixelSize = mix(pixelSize, .002, u_strokeCap * (1. - clamp(l, 0., 1.)));

  float res = smoothstep(width - pixelSize - u_softness, width + pixelSize + u_softness, shape);

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;

  color += bgColor * (1. - opacity);
  opacity += bgOpacity * (1. - opacity);

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}
`,op={name:"Default",params:{...i.defaultPatternSizing,scale:1,colorBack:"#001429",colorFront:"#79D1FF",density:1,distortion:0,strokeWidth:.5,strokeTaper:0,strokeCap:0,noise:0,noiseFrequency:0,softness:0,speed:1,frame:0}},od={name:"Droplet",params:{...i.defaultPatternSizing,colorBack:"#effafe",colorFront:"#bf40a0",density:.9,distortion:0,strokeWidth:.75,strokeTaper:.18,strokeCap:1,noise:.74,noiseFrequency:.33,softness:.02,speed:1,frame:0}},og=[op,{name:"Jungle",params:{...i.defaultPatternSizing,scale:1.3,density:.5,colorBack:"#a0ef2a",colorFront:"#288b18",distortion:0,strokeWidth:.5,strokeTaper:0,strokeCap:0,noise:1,noiseFrequency:.25,softness:0,speed:.75,frame:0}},od,{name:"Swirl",params:{...i.defaultPatternSizing,scale:.45,colorBack:"#b3e6d9",colorFront:"#1a2b4d",density:.2,distortion:0,strokeWidth:.5,strokeTaper:0,strokeCap:0,noise:0,noiseFrequency:.3,softness:.5,speed:1,frame:0}}],ov=(0,t.memo)(function({speed:o=op.params.speed,frame:a=op.params.frame,colorBack:t=op.params.colorBack,colorFront:r=op.params.colorFront,density:l=op.params.density,distortion:n=op.params.distortion,strokeWidth:f=op.params.strokeWidth,strokeTaper:c=op.params.strokeTaper,strokeCap:m=op.params.strokeCap,noiseFrequency:p=op.params.noiseFrequency,noise:d=op.params.noise,softness:g=op.params.softness,fit:v=op.params.fit,rotation:h=op.params.rotation,scale:_=op.params.scale,originX:x=op.params.originX,originY:y=op.params.originY,offsetX:b=op.params.offsetX,offsetY:S=op.params.offsetY,worldWidth:C=op.params.worldWidth,worldHeight:w=op.params.worldHeight,...k}){let z={u_colorBack:(0,s.getShaderColorFromString)(t),u_colorFront:(0,s.getShaderColorFromString)(r),u_density:l,u_distortion:n,u_strokeWidth:f,u_strokeTaper:c,u_strokeCap:m,u_noiseFrequency:p,u_noise:d,u_softness:g,u_fit:i.ShaderFitOptions[v],u_scale:_,u_rotation:h,u_offsetX:b,u_offsetY:S,u_originX:x,u_originY:y,u_worldWidth:C,u_worldHeight:w};return(0,u.jsx)(e.ShaderMount,{...k,speed:o,frame:a,fragmentShader:om,uniforms:z})},r.colorPropsAreEqual),oh={maxColorCount:10},o_=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${oh.maxColorCount}];
uniform float u_colorsCount;
uniform float u_bandCount;
uniform float u_twist;
uniform float u_center;
uniform float u_proportion;
uniform float u_softness;
uniform float u_noise;
uniform float u_noiseFrequency;

in vec2 v_objectUV;

out vec4 fragColor;

${n.declarePI}
${n.simplexNoise}
${n.rotation2}

void main() {
  vec2 shape_uv = v_objectUV;

  float l = length(shape_uv);
  l = max(1e-4, l);

  float t = u_time;

  float angle = ceil(u_bandCount) * atan(shape_uv.y, shape_uv.x) + t;
  float angle_norm = angle / TWO_PI;

  float twist = 3. * clamp(u_twist, 0., 1.);
  float offset = pow(l, -twist) + angle_norm;

  float shape = fract(offset);
  shape = 1. - abs(2. * shape - 1.);
  shape += u_noise * snoise(15. * pow(u_noiseFrequency, 2.) * shape_uv);

  float mid = smoothstep(.2, .2 + .8 * u_center, pow(l, twist));
  shape = mix(0., shape, mid);

  float proportion = clamp(u_proportion, 0., 1.);
  float exponent = mix(.25, 1., proportion * 2.);
  exponent = mix(exponent, 10., max(0., proportion * 2. - 1.));
  shape = pow(shape, exponent);

  float mixer = shape * u_colorsCount;
  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;

  float outerShape = 0.;
  for (int i = 1; i < ${oh.maxColorCount+1}; i++) {
    if (i > int(u_colorsCount)) break;

    float m = clamp(mixer - float(i - 1), 0., 1.);
    float aa = fwidth(m);
    m = smoothstep(.5 - .5 * u_softness - aa, .5 + .5 * u_softness + aa, m);

    if (i == 1) {
      outerShape = m;
    }

    vec4 c = u_colors[i - 1];
    c.rgb *= c.a;
    gradient = mix(gradient, c, m);
  }

  float midAA = .1 * fwidth(pow(l, -twist));
  float outerMid = smoothstep(.2, .2 + midAA, pow(l, twist));
  outerShape = mix(0., outerShape, outerMid);

  vec3 color = gradient.rgb * outerShape;
  float opacity = gradient.a * outerShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1.0 - opacity);
  opacity = opacity + u_colorBack.a * (1.0 - opacity);

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}
`,ox={name:"Default",params:{...i.defaultObjectSizing,speed:.32,frame:0,colorBack:"#330000",colors:["#ffd1d1","#ff8a8a","#660000"],bandCount:4,twist:.1,center:.2,proportion:.5,softness:0,noiseFrequency:.4,noise:.2}},oy={name:"Opening",params:{...i.defaultObjectSizing,offsetX:-.4,offsetY:1,speed:.5,frame:0,colorBack:"#ff8b61",colors:["#fefff0","#ffd8bd","#ff8b61"],bandCount:2,twist:.3,center:.2,proportion:.5,softness:0,noiseFrequency:0,noise:0,scale:1}},ob=[ox,{name:"007",params:{...i.defaultObjectSizing,speed:1,frame:0,colorBack:"#E9E7DA",colors:["#000000"],bandCount:5,twist:.3,center:0,proportion:0,softness:0,noiseFrequency:.5,noise:0}},oy,{name:"Candy",params:{...i.defaultObjectSizing,speed:1,frame:0,colorBack:"#ffcd66",colors:["#6bbceb","#d7b3ff","#ff9fff"],bandCount:2,twist:.15,center:.2,proportion:.5,softness:1,noiseFrequency:.5,noise:0}}],oS=(0,t.memo)(function({speed:o=ox.params.speed,frame:a=ox.params.frame,colorBack:t=ox.params.colorBack,colors:r=ox.params.colors,bandCount:l=ox.params.bandCount,twist:n=ox.params.twist,center:f=ox.params.center,proportion:c=ox.params.proportion,softness:m=ox.params.softness,noiseFrequency:p=ox.params.noiseFrequency,noise:d=ox.params.noise,fit:g=ox.params.fit,rotation:v=ox.params.rotation,scale:h=ox.params.scale,originX:_=ox.params.originX,originY:x=ox.params.originY,offsetX:y=ox.params.offsetX,offsetY:b=ox.params.offsetY,worldWidth:S=ox.params.worldWidth,worldHeight:C=ox.params.worldHeight,...w}){let k={u_colorBack:(0,s.getShaderColorFromString)(t),u_colors:r.map(s.getShaderColorFromString),u_colorsCount:r.length,u_bandCount:l,u_twist:n,u_center:f,u_proportion:c,u_softness:m,u_noiseFrequency:p,u_noise:d,u_fit:i.ShaderFitOptions[g],u_scale:h,u_rotation:v,u_offsetX:y,u_offsetY:b,u_originX:_,u_originY:x,u_worldWidth:S,u_worldHeight:C};return(0,u.jsx)(e.ShaderMount,{...w,speed:o,frame:a,fragmentShader:o_,uniforms:k})},r.colorPropsAreEqual),oC=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

uniform float u_pxSize;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_shape;
uniform float u_type;

out vec4 fragColor;

${n.simplexNoise}
${n.declarePI}
${n.proceduralHash11}
${n.proceduralHash21}

float getSimplexNoise(vec2 uv, float t) {
  float noise = .5 * snoise(uv - vec2(0., .3 * t));
  noise += .5 * snoise(2. * uv + vec2(0., .32 * t));

  return noise;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
0, 8, 2, 10,
12, 4, 14, 6,
3, 11, 1, 9,
15, 7, 13, 5
);

const int bayer8x8[64] = int[64](
0, 32, 8, 40, 2, 34, 10, 42,
48, 16, 56, 24, 50, 18, 58, 26,
12, 44, 4, 36, 14, 46, 6, 38,
60, 28, 52, 20, 62, 30, 54, 22,
3, 35, 11, 43, 1, 33, 9, 41,
51, 19, 59, 27, 49, 17, 57, 25,
15, 47, 7, 39, 13, 45, 5, 37,
63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(fract(uv / float(size)) * float(size));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}


void main() {
  float t = .5 * u_time;

  float pxSize = u_pxSize * u_pixelRatio;
  vec2 pxSizeUV = gl_FragCoord.xy - .5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + .5) * pxSize;
  vec2 normalizedUV = canvasPixelizedUV / u_resolution;

  vec2 ditheringNoiseUV = canvasPixelizedUV;
  vec2 shapeUV = normalizedUV;

  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * PI / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 boxSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  
  if (u_shape > 3.5) {
    vec2 objectBoxSize = vec2(0.);
    // fit = none
    objectBoxSize.x = min(boxSize.x, boxSize.y);
    if (u_fit == 1.) { // fit = contain
      objectBoxSize.x = min(u_resolution.x, u_resolution.y);
    } else if (u_fit == 2.) { // fit = cover
      objectBoxSize.x = max(u_resolution.x, u_resolution.y);
    }
    objectBoxSize.y = objectBoxSize.x;
    vec2 objectWorldScale = u_resolution.xy / objectBoxSize;

    shapeUV *= objectWorldScale;
    shapeUV += boxOrigin * (objectWorldScale - 1.);
    shapeUV += vec2(-u_offsetX, u_offsetY);
    shapeUV /= u_scale;
    shapeUV = graphicRotation * shapeUV;
  } else {
    vec2 patternBoxSize = vec2(0.);
    // fit = none
    patternBoxSize.x = patternBoxRatio * min(boxSize.x / patternBoxRatio, boxSize.y);
    float patternWorldNoFitBoxWidth = patternBoxSize.x;
    if (u_fit == 1.) { // fit = contain
      patternBoxSize.x = patternBoxRatio * min(u_resolution.x / patternBoxRatio, u_resolution.y);
    } else if (u_fit == 2.) { // fit = cover
      patternBoxSize.x = patternBoxRatio * max(u_resolution.x / patternBoxRatio, u_resolution.y);
    }
    patternBoxSize.y = patternBoxSize.x / patternBoxRatio;
    vec2 patternWorldScale = u_resolution.xy / patternBoxSize;

    shapeUV += vec2(-u_offsetX, u_offsetY) / patternWorldScale;
    shapeUV += boxOrigin;
    shapeUV -= boxOrigin / patternWorldScale;
    shapeUV *= u_resolution.xy;
    shapeUV /= u_pixelRatio;
    if (u_fit > 0.) {
      shapeUV *= (patternWorldNoFitBoxWidth / patternBoxSize.x);
    }
    shapeUV /= u_scale;
    shapeUV = graphicRotation * shapeUV;
    shapeUV += boxOrigin / patternWorldScale;
    shapeUV -= boxOrigin;
    shapeUV += .5;
  }

  float shape = 0.;
  if (u_shape < 1.5) {
    // Simplex noise
    shapeUV *= .001;

    shape = 0.5 + 0.5 * getSimplexNoise(shapeUV, t);
    shape = smoothstep(0.3, 0.9, shape);

  } else if (u_shape < 2.5) {
    // Warp
    shapeUV *= .003;

    for (float i = 1.0; i < 6.0; i++) {
      shapeUV.x += 0.6 / i * cos(i * 2.5 * shapeUV.y + t);
      shapeUV.y += 0.6 / i * cos(i * 1.5 * shapeUV.x + t);
    }

    shape = .15 / max(0.001, abs(sin(t - shapeUV.y - shapeUV.x)));
    shape = smoothstep(0.02, 1., shape);

  } else if (u_shape < 3.5) {
    // Dots
    shapeUV *= .05;

    float stripeIdx = floor(2. * shapeUV.x / TWO_PI);
    float rand = hash11(stripeIdx * 10.);
    rand = sign(rand - .5) * pow(.1 + abs(rand), .4);
    shape = sin(shapeUV.x) * cos(shapeUV.y - 5. * rand * t);
    shape = pow(abs(shape), 6.);

  } else if (u_shape < 4.5) {
    // Sine wave
    shapeUV *= 4.;

    float wave = cos(.5 * shapeUV.x - 2. * t) * sin(1.5 * shapeUV.x + t) * (.75 + .25 * cos(3. * t));
    shape = 1. - smoothstep(-1., 1., shapeUV.y + wave);

  } else if (u_shape < 5.5) {
    // Ripple

    float dist = length(shapeUV);
    float waves = sin(pow(dist, 1.7) * 7. - 3. * t) * .5 + .5;
    shape = waves;

  } else if (u_shape < 6.5) {
    // Swirl

    float l = length(shapeUV);
    float angle = 6. * atan(shapeUV.y, shapeUV.x) + 4. * t;
    float twist = 1.2;
    float offset = 1. / pow(max(l, 1e-6), twist) + angle / TWO_PI;
    float mid = smoothstep(0., 1., pow(l, twist));
    shape = mix(0., fract(offset), mid);

  } else {
    // Sphere
    shapeUV *= 2.;

    float d = 1. - pow(length(shapeUV), 2.);
    vec3 pos = vec3(shapeUV, sqrt(max(0., d)));
    vec3 lightPos = normalize(vec3(cos(1.5 * t), .8, sin(1.25 * t)));
    shape = .5 + .5 * dot(lightPos, pos);
    shape *= step(0., d);
  }


  int type = int(floor(u_type));
  float dithering = 0.0;

  switch (type) {
    case 1: {
      dithering = step(hash21(ditheringNoiseUV), shape);
    } break;
    case 2:
    dithering = getBayerValue(pxSizeUV, 2);
    break;
    case 3:
    dithering = getBayerValue(pxSizeUV, 4);
    break;
    default :
    dithering = getBayerValue(pxSizeUV, 8);
    break;
  }

  dithering -= .5;
  float res = step(.5, shape + dithering);

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;

  color += bgColor * (1. - opacity);
  opacity += bgOpacity * (1. - opacity);

  fragColor = vec4(color, opacity);
}
`,ow={simplex:1,warp:2,dots:3,wave:4,ripple:5,swirl:6,sphere:7},ok={random:1,"2x2":2,"4x4":3,"8x8":4},oz={name:"Default",params:{...i.defaultPatternSizing,speed:1,frame:0,scale:.6,colorBack:"#000000",colorFront:"#00b2ff",shape:"sphere",type:"4x4",size:2}},oB={name:"Sine Wave",params:{...i.defaultPatternSizing,speed:1,frame:0,colorBack:"#730d54",colorFront:"#00becc",shape:"wave",type:"4x4",size:11,scale:1.2}},oO={name:"Bugs",params:{...i.defaultPatternSizing,speed:1,frame:0,colorBack:"#000000",colorFront:"#008000",shape:"dots",type:"random",size:9}},oF={name:"Ripple",params:{...i.defaultObjectSizing,speed:1,frame:0,colorBack:"#603520",colorFront:"#c67953",shape:"ripple",type:"2x2",size:3}},oU={name:"Swirl",params:{...i.defaultObjectSizing,speed:1,frame:0,colorBack:"#00000000",colorFront:"#47a8e1",shape:"swirl",type:"8x8",size:2}},oV=[oz,{name:"Warp",params:{...i.defaultObjectSizing,speed:1,frame:0,colorBack:"#301c2a",colorFront:"#56ae6c",shape:"warp",type:"4x4",size:2.5}},oB,oF,oO,oU],oR=(0,t.memo)(function({speed:o=oz.params.speed,frame:a=oz.params.frame,colorBack:t=oz.params.colorBack,colorFront:r=oz.params.colorFront,shape:l=oz.params.shape,type:n=oz.params.type,pxSize:f,size:c=void 0===f?oz.params.size:f,fit:m=oz.params.fit,scale:p=oz.params.scale,rotation:d=oz.params.rotation,originX:g=oz.params.originX,originY:v=oz.params.originY,offsetX:h=oz.params.offsetX,offsetY:_=oz.params.offsetY,worldWidth:x=oz.params.worldWidth,worldHeight:y=oz.params.worldHeight,...b}){let S={u_colorBack:(0,s.getShaderColorFromString)(t),u_colorFront:(0,s.getShaderColorFromString)(r),u_shape:ow[l],u_type:ok[n],u_pxSize:c,u_fit:i.ShaderFitOptions[m],u_scale:p,u_rotation:d,u_offsetX:h,u_offsetY:_,u_originX:g,u_originY:v,u_worldWidth:x,u_worldHeight:y};return(0,u.jsx)(e.ShaderMount,{...b,speed:o,frame:a,fragmentShader:oC,uniforms:S})}),oM={maxColorCount:7},oP=`#version 300 es
precision lowp float;

uniform mediump float u_time;
uniform mediump vec2 u_resolution;
uniform mediump float u_pixelRatio;

uniform sampler2D u_noiseTexture;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${oM.maxColorCount}];
uniform float u_colorsCount;
uniform float u_softness;
uniform float u_intensity;
uniform float u_noise;
uniform float u_shape;

uniform mediump float u_originX;
uniform mediump float u_originY;
uniform mediump float u_worldWidth;
uniform mediump float u_worldHeight;
uniform mediump float u_fit;

uniform mediump float u_scale;
uniform mediump float u_rotation;
uniform mediump float u_offsetX;
uniform mediump float u_offsetY;

in vec2 v_objectUV;
in vec2 v_patternUV;
in vec2 v_objectBoxSize;
in vec2 v_patternBoxSize;

out vec4 fragColor;

${n.declarePI}
${n.simplexNoise}
${n.rotation2}
${n.textureRandomizerR}

float valueNoiseR(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomR(i);
  float b = randomR(i + vec2(1.0, 0.0));
  float c = randomR(i + vec2(0.0, 1.0));
  float d = randomR(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}
vec4 fbmR(vec2 n0, vec2 n1, vec2 n2, vec2 n3) {
  float amplitude = 0.2;
  vec4 total = vec4(0.);
  for (int i = 0; i < 3; i++) {
    n0 = rotate(n0, 0.3);
    n1 = rotate(n1, 0.3);
    n2 = rotate(n2, 0.3);
    n3 = rotate(n3, 0.3);
    total.x += valueNoiseR(n0) * amplitude;
    total.y += valueNoiseR(n1) * amplitude;
    total.z += valueNoiseR(n2) * amplitude;
    total.z += valueNoiseR(n3) * amplitude;
    n0 *= 1.99;
    n1 *= 1.99;
    n2 *= 1.99;
    n3 *= 1.99;
    amplitude *= 0.6;
  }
  return total;
}

${n.proceduralHash11}

vec2 truchet(vec2 uv, float idx){
  idx = fract(((idx - .5) * 2.));
  if (idx > 0.75) {
    uv = vec2(1.0) - uv;
  } else if (idx > 0.5) {
    uv = vec2(1.0 - uv.x, uv.y);
  } else if (idx > 0.25) {
    uv = 1.0 - vec2(1.0 - uv.x, uv.y);
  }
  return uv;
}

void main() {

  const float firstFrameOffset = 7.;
  float t = .1 * (u_time + firstFrameOffset);

  vec2 shape_uv = vec2(0.);
  vec2 grain_uv = vec2(0.);

  float r = u_rotation * PI / 180.;
  float cr = cos(r);
  float sr = sin(r);
  mat2 graphicRotation = mat2(cr, sr, -sr, cr);
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  if (u_shape > 3.5) {
    shape_uv = v_objectUV;
    grain_uv = shape_uv;

    // apply inverse transform to grain_uv so it respects the originXY
    grain_uv = transpose(graphicRotation) * grain_uv;
    grain_uv *= u_scale;
    grain_uv -= graphicOffset;
    grain_uv *= v_objectBoxSize;
    grain_uv *= .7;
  } else {
    shape_uv = .5 * v_patternUV;
    grain_uv = 100. * v_patternUV;

    // apply inverse transform to grain_uv so it respects the originXY
    grain_uv = transpose(graphicRotation) * grain_uv;
    grain_uv *= u_scale;
    if (u_fit > 0.) {
      vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
      givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
      float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
      vec2 patternBoxGivenSize = vec2(
      (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
      (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
      );
      patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;
      float patternBoxNoFitBoxWidth = patternBoxRatio * min(patternBoxGivenSize.x / patternBoxRatio, patternBoxGivenSize.y);
      grain_uv /= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
    }
    vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;
    grain_uv -= graphicOffset / patternBoxScale;
    grain_uv *= 1.6;
  }


  float shape = 0.;

  if (u_shape < 1.5) {
    // Sine wave

    float wave = cos(.5 * shape_uv.x - 4. * t) * sin(1.5 * shape_uv.x + 2. * t) * (.75 + .25 * cos(6. * t));
    shape = 1. - smoothstep(-1., 1., shape_uv.y + wave);

  } else if (u_shape < 2.5) {
    // Grid (dots)

    float stripeIdx = floor(2. * shape_uv.x / TWO_PI);
    float rand = hash11(stripeIdx * 100.);
    rand = sign(rand - .5) * pow(4. * abs(rand), .3);
    shape = sin(shape_uv.x) * cos(shape_uv.y - 5. * rand * t);
    shape = pow(abs(shape), 4.);

  } else if (u_shape < 3.5) {
    // Truchet pattern

    float n2 = valueNoiseR(shape_uv * .4 - 3.75 * t);
    shape_uv.x += 10.;
    shape_uv *= .6;

    vec2 tile = truchet(fract(shape_uv), randomR(floor(shape_uv)));

    float distance1 = length(tile);
    float distance2 = length(tile - vec2(1.));

    n2 -= .5;
    n2 *= .1;
    shape = smoothstep(.2, .55, distance1 + n2) * (1. - smoothstep(.45, .8, distance1 - n2));
    shape += smoothstep(.2, .55, distance2 + n2) * (1. - smoothstep(.45, .8, distance2 - n2));

    shape = pow(shape, 1.5);

  } else if (u_shape < 4.5) {
    // Corners

    shape_uv *= .6;
    vec2 outer = vec2(.5);

    vec2 bl = smoothstep(vec2(0.), outer, shape_uv + vec2(.1 + .1 * sin(3. * t), .2 - .1 * sin(5.25 * t)));
    vec2 tr = smoothstep(vec2(0.), outer, 1. - shape_uv);
    shape = 1. - bl.x * bl.y * tr.x * tr.y;

    shape_uv = -shape_uv;
    bl = smoothstep(vec2(0.), outer, shape_uv + vec2(.1 + .1 * sin(3. * t), .2 - .1 * cos(5.25 * t)));
    tr = smoothstep(vec2(0.), outer, 1. - shape_uv);
    shape -= bl.x * bl.y * tr.x * tr.y;

    shape = 1. - smoothstep(0., 1., shape);

  } else if (u_shape < 5.5) {
    // Ripple

    shape_uv *= 2.;
    float dist = length(.4 * shape_uv);
    float waves = sin(pow(dist, 1.2) * 5. - 3. * t) * .5 + .5;
    shape = waves;

  } else if (u_shape < 6.5) {
    // Blob

    t *= 2.;

    vec2 f1_traj = .25 * vec2(1.3 * sin(t), .2 + 1.3 * cos(.6 * t + 4.));
    vec2 f2_traj = .2 * vec2(1.2 * sin(-t), 1.3 * sin(1.6 * t));
    vec2 f3_traj = .25 * vec2(1.7 * cos(-.6 * t), cos(-1.6 * t));
    vec2 f4_traj = .3 * vec2(1.4 * cos(.8 * t), 1.2 * sin(-.6 * t - 3.));

    shape = .5 * pow(1. - clamp(0., 1., length(shape_uv + f1_traj)), 5.);
    shape += .5 * pow(1. - clamp(0., 1., length(shape_uv + f2_traj)), 5.);
    shape += .5 * pow(1. - clamp(0., 1., length(shape_uv + f3_traj)), 5.);
    shape += .5 * pow(1. - clamp(0., 1., length(shape_uv + f4_traj)), 5.);

    shape = smoothstep(.0, .9, shape);
    float edge = smoothstep(.25, .3, shape);
    shape = mix(.0, shape, edge);

  } else {
    // Sphere

    shape_uv *= 2.;
    float d = 1. - pow(length(shape_uv), 2.);
    vec3 pos = vec3(shape_uv, sqrt(max(d, 0.)));
    vec3 lightPos = normalize(vec3(cos(1.5 * t), .8, sin(1.25 * t)));
    shape = .5 + .5 * dot(lightPos, pos);
    shape *= step(0., d);
  }

  float baseNoise = snoise(grain_uv * .5);
  vec4 fbmVals = fbmR(
  .002 * grain_uv + 10.,
  .003 * grain_uv,
  .001 * grain_uv,
  rotate(.4 * grain_uv, 2.)
  );
  float grainDist = baseNoise * snoise(grain_uv * .2) - fbmVals.x - fbmVals.y;
  float rawNoise = .75 * baseNoise - fbmVals.w - fbmVals.z;
  float noise = clamp(rawNoise, 0., 1.);

  shape += u_intensity * 2. / u_colorsCount * (grainDist + .5);
  shape += u_noise * 10. / u_colorsCount * noise;

  float aa = fwidth(shape);

  shape = clamp(shape - .5 / u_colorsCount, 0., 1.);
  float totalShape = smoothstep(0., u_softness + 2. * aa, clamp(shape * u_colorsCount, 0., 1.));
  float mixer = shape * (u_colorsCount - 1.);

  int cntStop = int(u_colorsCount) - 1;
  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;
  for (int i = 1; i < ${oM.maxColorCount}; i++) {
    if (i > cntStop) break;

    float localT = clamp(mixer - float(i - 1), 0., 1.);
    localT = smoothstep(.5 - .5 * u_softness - aa, .5 + .5 * u_softness + aa, localT);

    vec4 c = u_colors[i];
    c.rgb *= c.a;
    gradient = mix(gradient, c, localT);
  }

  vec3 color = gradient.rgb * totalShape;
  float opacity = gradient.a * totalShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1.0 - opacity);
  opacity = opacity + u_colorBack.a * (1.0 - opacity);

  fragColor = vec4(color, opacity);
}
`,oY={wave:1,dots:2,truchet:3,corners:4,ripple:5,blob:6,sphere:7},oI={name:"Default",params:{...i.defaultObjectSizing,speed:1,frame:0,colorBack:"#000000",colors:["#7300ff","#eba8ff","#00bfff","#2a00ff"],softness:.5,intensity:.5,noise:.25,shape:"corners"}},oA=[oI,{name:"Wave",params:{...i.defaultPatternSizing,speed:1,frame:0,colorBack:"#000a0f",colors:["#c4730b","#bdad5f","#d8ccc7"],softness:.7,intensity:.15,noise:.5,shape:"wave"}},{name:"Dots",params:{...i.defaultPatternSizing,scale:.6,speed:1,frame:0,colorBack:"#0a0000",colors:["#6f0000","#0080ff","#f2ebc9","#33cc33"],softness:1,intensity:1,noise:.7,shape:"dots"}},{name:"Truchet",params:{...i.defaultPatternSizing,speed:1,frame:0,colorBack:"#0a0000",colors:["#6f2200","#eabb7c","#39b523"],softness:0,intensity:.2,noise:1,shape:"truchet"}},{name:"Ripple",params:{...i.defaultObjectSizing,scale:.5,speed:1,frame:0,colorBack:"#140a00",colors:["#6f2d00","#88ddae","#2c0b1d"],softness:.5,intensity:.5,noise:.5,shape:"ripple"}},{name:"Blob",params:{...i.defaultObjectSizing,scale:1.3,speed:1,frame:0,colorBack:"#0f0e18",colors:["#3e6172","#a49b74","#568c50"],softness:0,intensity:.15,noise:.5,shape:"blob"}}],oN=(0,t.memo)(function({speed:o=oI.params.speed,frame:a=oI.params.frame,colorBack:t=oI.params.colorBack,colors:r=oI.params.colors,softness:n=oI.params.softness,intensity:f=oI.params.intensity,noise:c=oI.params.noise,shape:m=oI.params.shape,fit:p=oI.params.fit,scale:d=oI.params.scale,rotation:g=oI.params.rotation,originX:v=oI.params.originX,originY:h=oI.params.originY,offsetX:_=oI.params.offsetX,offsetY:x=oI.params.offsetY,worldWidth:y=oI.params.worldWidth,worldHeight:b=oI.params.worldHeight,...S}){let C={u_colorBack:(0,s.getShaderColorFromString)(t),u_colors:r.map(s.getShaderColorFromString),u_colorsCount:r.length,u_softness:n,u_intensity:f,u_noise:c,u_shape:oY[m],u_noiseTexture:(0,l.getShaderNoiseTexture)(),u_fit:i.ShaderFitOptions[p],u_scale:d,u_rotation:g,u_offsetX:_,u_offsetY:x,u_originX:v,u_originY:h,u_worldWidth:y,u_worldHeight:b};return(0,u.jsx)(e.ShaderMount,{...S,speed:o,frame:a,fragmentShader:oP,uniforms:C})}),oX={maxColorCount:5,maxSpots:4},oT=`#version 300 es
precision lowp float;

uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${oX.maxColorCount}];
uniform float u_colorsCount;
uniform float u_roundness;
uniform float u_thickness;
uniform float u_marginLeft;
uniform float u_marginRight;
uniform float u_marginTop;
uniform float u_marginBottom;
uniform float u_aspectRatio;
uniform float u_softness;
uniform float u_intensity;
uniform float u_bloom;
uniform float u_spotSize;
uniform float u_spots;
uniform float u_pulse;
uniform float u_smoke;
uniform float u_smokeSize;

uniform sampler2D u_noiseTexture;

in vec2 v_responsiveUV;
in vec2 v_responsiveBoxGivenSize;
in vec2 v_patternUV;

out vec4 fragColor;

${n.declarePI}

float beat(float time) {
  float first = pow(abs(sin(time * TWO_PI)), 10.);
  float second = pow(abs(sin((time - .15) * TWO_PI)), 10.);

  return clamp(first + 0.6 * second, 0.0, 1.0);
}

float sst(float edge0, float edge1, float x) {
  return smoothstep(edge0, edge1, x);
}

float roundedBox(vec2 uv, vec2 halfSize, float distance, float cornerDistance, float thickness, float softness) {
  float borderDistance = abs(distance);
  float aa = 2. * fwidth(distance);
  float border = 1. - sst(min(mix(thickness, -thickness, softness), thickness + aa), max(mix(thickness, -thickness, softness), thickness + aa), borderDistance);
  float cornerFadeCircles = 0.;
  cornerFadeCircles = mix(1., cornerFadeCircles, sst(0., 1., length((uv + halfSize) / thickness)));
  cornerFadeCircles = mix(1., cornerFadeCircles, sst(0., 1., length((uv - vec2(-halfSize.x, halfSize.y)) / thickness)));
  cornerFadeCircles = mix(1., cornerFadeCircles, sst(0., 1., length((uv - vec2(halfSize.x, -halfSize.y)) / thickness)));
  cornerFadeCircles = mix(1., cornerFadeCircles, sst(0., 1., length((uv - halfSize) / thickness)));
  aa = fwidth(cornerDistance);
  float cornerFade = sst(0., mix(aa, thickness, softness), cornerDistance);
  cornerFade *= cornerFadeCircles;
  border += cornerFade;
  return border;
}

${n.textureRandomizerGB}

float randomG(vec2 p) {
  vec2 uv = floor(p) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).g;
}
float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomG(i);
  float b = randomG(i + vec2(1.0, 0.0));
  float c = randomG(i + vec2(0.0, 1.0));
  float d = randomG(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

void main() {
  const float firstFrameOffset = 109.;
  float t = 1.2 * (u_time + firstFrameOffset);

  vec2 borderUV = v_responsiveUV;
  float pulse = u_pulse * beat(.18 * u_time);

  float canvasRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 halfSize = vec2(.5);
  borderUV.x *= max(canvasRatio, 1.);
  borderUV.y /= min(canvasRatio, 1.);
  halfSize.x *= max(canvasRatio, 1.);
  halfSize.y /= min(canvasRatio, 1.);

  float mL = u_marginLeft;
  float mR = u_marginRight;
  float mT = u_marginTop;
  float mB = u_marginBottom;
  float mX = mL + mR;
  float mY = mT + mB;

  if (u_aspectRatio > 0.) {
    float shapeRatio = canvasRatio * (1. - mX) / max(1. - mY, 1e-6);
    float freeX = shapeRatio > 1. ? (1. - mX) * (1. - 1. / max(abs(shapeRatio), 1e-6)) : 0.;
    float freeY = shapeRatio < 1. ? (1. - mY) * (1. - shapeRatio) : 0.;
    mL += freeX * 0.5;
    mR += freeX * 0.5;
    mT += freeY * 0.5;
    mB += freeY * 0.5;
    mX = mL + mR;
    mY = mT + mB;
  }

  float thickness = .5 * u_thickness * min(halfSize.x, halfSize.y);

  halfSize.x *= (1. - mX);
  halfSize.y *= (1. - mY);

  vec2 centerShift = vec2(
  (mL - mR) * max(canvasRatio, 1.) * 0.5,
  (mB - mT) / min(canvasRatio, 1.) * 0.5
  );

  borderUV -= centerShift;
  halfSize -= mix(thickness, 0., u_softness);

  float radius = mix(0., min(halfSize.x, halfSize.y), u_roundness);
  vec2 d = abs(borderUV) - halfSize + radius;
  float outsideDistance = length(max(d, .0001)) - radius;
  float insideDistance = min(max(d.x, d.y), .0001);
  float cornerDistance = abs(min(max(d.x, d.y) - .45 * radius, .0));
  float distance = outsideDistance + insideDistance;

  float borderThickness = mix(thickness, 3. * thickness, u_softness);
  float border = roundedBox(borderUV, halfSize, distance, cornerDistance, borderThickness, u_softness);
  border = pow(border, 1. + u_softness);

  vec2 smokeUV = .3 * u_smokeSize * v_patternUV;
  float smoke = clamp(3. * valueNoise(2.7 * smokeUV + .5 * t), 0., 1.);
  smoke -= valueNoise(3.4 * smokeUV - .5 * t);
  float smokeThickness = thickness + .2;
  smokeThickness = min(.4, max(smokeThickness, .1));
  smoke *= roundedBox(borderUV, halfSize, distance, cornerDistance, smokeThickness, 1.);
  smoke = 30. * smoke * smoke;
  smoke *= mix(0., .5, pow(u_smoke, 2.));
  smoke *= mix(1., pulse, u_pulse);
  smoke = clamp(smoke, 0., 1.);
  border += smoke;

  border = clamp(border, 0., 1.);

  vec3 blendColor = vec3(0.);
  float blendAlpha = 0.;
  vec3 addColor = vec3(0.);
  float addAlpha = 0.;

  float bloom = 4. * u_bloom;
  float intensity = 1. + (1. + 4. * u_softness) * u_intensity;

  float angle = atan(borderUV.y, borderUV.x) / TWO_PI;

  for (int colorIdx = 0; colorIdx < ${oX.maxColorCount}; colorIdx++) {
    if (colorIdx >= int(u_colorsCount)) break;
    float colorIdxF = float(colorIdx);

    vec3 c = u_colors[colorIdx].rgb * u_colors[colorIdx].a;
    float a = u_colors[colorIdx].a;

    for (int spotIdx = 0; spotIdx < ${oX.maxSpots}; spotIdx++) {
      if (spotIdx >= int(u_spots)) break;
      float spotIdxF = float(spotIdx);

      vec2 randVal = randomGB(vec2(spotIdxF * 10. + 2., 40. + colorIdxF));

      float time = (.1 + .15 * abs(sin(spotIdxF * (2. + colorIdxF)) * cos(spotIdxF * (2. + 2.5 * colorIdxF)))) * t + randVal.x * 3.;
      time *= mix(1., -1., step(.5, randVal.y));

      float mask = .5 + .5 * mix(
      sin(t + spotIdxF * (5. - 1.5 * colorIdxF)),
      cos(t + spotIdxF * (3. + 1.3 * colorIdxF)),
      step(mod(colorIdxF, 2.), .5)
      );

      float p = clamp(2. * u_pulse - randVal.x, 0., 1.);
      mask = mix(mask, pulse, p);

      float atg1 = fract(angle + time);
      float spotSize = .05 + .6 * pow(u_spotSize, 2.) + .05 * randVal.x;
      spotSize = mix(spotSize, .1, p);
      float sector = sst(.5 - spotSize, .5, atg1) * (1. - sst(.5, .5 + spotSize, atg1));

      sector *= mask;
      sector *= border;
      sector *= intensity;
      sector = clamp(sector, 0., 1.);

      vec3 srcColor = c * sector;
      float srcAlpha = a * sector;

      blendColor += ((1. - blendAlpha) * srcColor);
      blendAlpha = blendAlpha + (1. - blendAlpha) * srcAlpha;
      addColor += srcColor;
      addAlpha += srcAlpha;
    }
  }

  vec3 accumColor = mix(blendColor, addColor, bloom);
  float accumAlpha = mix(blendAlpha, addAlpha, bloom);
  accumAlpha = clamp(accumAlpha, 0., 1.);

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  vec3 color = accumColor + (1. - accumAlpha) * bgColor;
  float opacity = accumAlpha + (1. - accumAlpha) * u_colorBack.a;

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}`,oW={auto:0,square:1},oj={name:"Default",params:{...i.defaultObjectSizing,speed:1,frame:0,scale:.6,colorBack:"#000000",colors:["#0dc1fd","#d915ef","#ff3f2ecc"],roundness:.25,thickness:.1,margin:0,marginLeft:0,marginRight:0,marginTop:0,marginBottom:0,aspectRatio:"auto",softness:.75,intensity:.2,bloom:.25,spots:5,spotSize:.5,pulse:.25,smoke:.3,smokeSize:.6}},oD=[oj,{name:"Circle",params:{...i.defaultObjectSizing,aspectRatio:"square",scale:.6,speed:1,frame:0,colorBack:"#000000",colors:["#0dc1fd","#d915ef","#ff3f2ecc"],roundness:1,margin:0,marginLeft:0,marginRight:0,marginTop:0,marginBottom:0,thickness:0,softness:.75,intensity:.2,bloom:.45,spots:3,spotSize:.4,pulse:.5,smoke:1,smokeSize:0}},{name:"Northern lights",params:{...i.defaultObjectSizing,speed:.18,scale:1.1,frame:0,colors:["#4c4794","#774a7d","#12694a","#0aff78","#4733cc"],colorBack:"#0c182c",roundness:0,thickness:1,softness:1,margin:0,marginLeft:0,marginRight:0,marginTop:0,marginBottom:0,aspectRatio:"auto",intensity:.1,bloom:.2,spots:4,spotSize:.25,pulse:0,smoke:.32,smokeSize:.5}},{name:"Solid line",params:{...i.defaultObjectSizing,speed:1,frame:0,colors:["#81ADEC"],colorBack:"#00000000",roundness:0,thickness:.05,margin:0,marginLeft:0,marginRight:0,marginTop:0,marginBottom:0,aspectRatio:"auto",softness:0,intensity:0,bloom:.15,spots:4,spotSize:1,pulse:0,smoke:0,smokeSize:0}}],oG=(0,t.memo)(function({speed:o=oj.params.speed,frame:a=oj.params.frame,colors:t=oj.params.colors,colorBack:r=oj.params.colorBack,roundness:n=oj.params.roundness,thickness:f=oj.params.thickness,aspectRatio:c=oj.params.aspectRatio,softness:m=oj.params.softness,bloom:p=oj.params.bloom,intensity:d=oj.params.intensity,spots:g=oj.params.spots,spotSize:v=oj.params.spotSize,pulse:h=oj.params.pulse,smoke:_=oj.params.smoke,smokeSize:x=oj.params.smokeSize,margin:y,marginLeft:b=y??oj.params.marginLeft,marginRight:S=y??oj.params.marginRight,marginTop:C=y??oj.params.marginTop,marginBottom:w=y??oj.params.marginBottom,fit:k=oj.params.fit,rotation:z=oj.params.rotation,scale:B=oj.params.scale,originX:O=oj.params.originX,originY:F=oj.params.originY,offsetX:U=oj.params.offsetX,offsetY:V=oj.params.offsetY,worldWidth:R=oj.params.worldWidth,worldHeight:M=oj.params.worldHeight,...P}){let Y={u_colorBack:(0,s.getShaderColorFromString)(r),u_colors:t.map(s.getShaderColorFromString),u_colorsCount:t.length,u_roundness:n,u_thickness:f,u_marginLeft:b,u_marginRight:S,u_marginTop:C,u_marginBottom:w,u_aspectRatio:oW[c],u_softness:m,u_intensity:d,u_bloom:p,u_spots:g,u_spotSize:v,u_pulse:h,u_smoke:_,u_smokeSize:x,u_noiseTexture:(0,l.getShaderNoiseTexture)(),u_fit:i.ShaderFitOptions[k],u_rotation:z,u_scale:B,u_offsetX:U,u_offsetY:V,u_originX:O,u_originY:F,u_worldWidth:R,u_worldHeight:M};return(0,u.jsx)(e.ShaderMount,{...P,speed:o,frame:a,fragmentShader:oT,uniforms:Y})},r.colorPropsAreEqual),oH={maxColorCount:7},oq=`#version 300 es
precision lowp float;

uniform float u_time;
uniform mediump float u_scale;

uniform vec4 u_colors[${oH.maxColorCount}];
uniform float u_colorsCount;
uniform vec4 u_colorBack;
uniform float u_density;
uniform float u_angle1;
uniform float u_angle2;
uniform float u_length;
uniform bool u_edges;
uniform float u_blur;
uniform float u_fadeIn;
uniform float u_fadeOut;
uniform float u_gradient;

in vec2 v_objectUV;

out vec4 fragColor;

${n.declarePI}

const float zLimit = .5;

vec2 getPanel(float angle, vec2 uv, float invLength, float aa) {
  float sinA = sin(angle);
  float cosA = cos(angle);

  float denom = sinA - uv.y * cosA;
  if (abs(denom) < .01) return vec2(0.);

  float z = uv.y / denom;

  if (z <= 0. || z > zLimit) return vec2(0.);

  float zRatio = z / zLimit;
  float panelMap = 1. - zRatio;
  float x = uv.x * (cosA * z + 1.) * invLength;

  float zOffset = zRatio - .5;
  float left = -.5 + zOffset * u_angle1;
  float right = .5 - zOffset * u_angle2;
  float blurX = aa + 2. * panelMap * u_blur;

  float leftEdge1 = left - blurX;
  float leftEdge2 = left + .25 * blurX;
  float rightEdge1 = right - .25 * blurX;
  float rightEdge2 = right + blurX;

  float panel = smoothstep(leftEdge1, leftEdge2, x) * (1.0 - smoothstep(rightEdge1, rightEdge2, x));
  panel *= mix(0., panel, smoothstep(0., .01 / max(u_scale, 1e-6), panelMap));

  float midScreen = abs(sinA);
  if (u_edges == true) {
    panelMap = mix(.99, panelMap, panel * clamp(panelMap / (.15 * (1. - pow(midScreen, .1))), 0.0, 1.0));
  } else if (midScreen < .07) {
    panel *= (midScreen * 15.);
  }

  return vec2(panel, panelMap);
}

vec4 blendColor(vec4 colorA, float panelMask, float panelMap) {
  float fade = 1. - smoothstep(.97 - .97 * u_fadeIn, 1., panelMap);

  fade *= smoothstep(-.2 * (1. - u_fadeOut), u_fadeOut, panelMap);

  vec3 blendedRGB = mix(vec3(0.), colorA.rgb, fade);
  float blendedAlpha = mix(0., colorA.a, fade);

  return vec4(blendedRGB, blendedAlpha) * panelMask;
}

void main() {
  vec2 uv = v_objectUV;
  uv *= 1.25;

  float t = .02 * u_time;
  t = fract(t);
  bool reverseTime = (t < 0.5);

  vec3 color = vec3(0.);
  float opacity = 0.;

  float aa = .005 / u_scale;
  int colorsCount = int(u_colorsCount);

  vec4 premultipliedColors[${oH.maxColorCount}];
  for (int i = 0; i < ${oH.maxColorCount}; i++) {
    if (i >= colorsCount) break;
    vec4 c = u_colors[i];
    c.rgb *= c.a;
    premultipliedColors[i] = c;
  }

  float invLength = 1.5 / max(u_length, .001);

  float totalColorWeight = 0.;
  int panelsNumber = 12;

  float densityNormalizer = 1.;
  if (colorsCount == 4) {
    panelsNumber = 16;
    densityNormalizer = 1.34;
  } else if (colorsCount == 5) {
    panelsNumber = 20;
    densityNormalizer = 1.67;
  } else if (colorsCount == 7) {
    panelsNumber = 14;
    densityNormalizer = 1.17;
  }

  float fPanelsNumber = float(panelsNumber);

  float totalPanelsShape = 0.;
  float panelGrad = 1. - clamp(u_gradient, 0., 1.);

  for (int set = 0; set < 2; set++) {
    bool isForward = (set == 0 && !reverseTime) || (set == 1 && reverseTime);
    if (!isForward) continue;

    for (int i = 0; i <= 20; i++) {
      if (i >= panelsNumber) break;

      int idx = panelsNumber - 1 - i;

      float offset = float(idx) / fPanelsNumber;
      if (set == 1) {
        offset += .5;
      }

      float densityFract = densityNormalizer * fract(t + offset);
      float angleNorm = densityFract / u_density;
      if (densityFract >= .5 || angleNorm >= .3) continue;

      float smoothDensity = clamp((.5 - densityFract) / .1, 0., 1.) * clamp(densityFract / .01, 0., 1.);
      float smoothAngle = clamp((.3 - angleNorm) / .05, 0., 1.);
      if (smoothDensity * smoothAngle < .001) continue;

      if (angleNorm > .5) {
        angleNorm = 0.5;
      }
      vec2 panel = getPanel(angleNorm * TWO_PI + PI, uv, invLength, aa);
      if (panel[0] <= .001) continue;
      float panelMask = panel[0] * smoothDensity * smoothAngle;
      float panelMap = panel[1];

      int colorIdx = idx % colorsCount;
      int nextColorIdx = (idx + 1) % colorsCount;

      vec4 colorA = premultipliedColors[colorIdx];
      vec4 colorB = premultipliedColors[nextColorIdx];

      colorA = mix(colorA, colorB, max(0., smoothstep(.0, .45, panelMap) - panelGrad));
      vec4 blended = blendColor(colorA, panelMask, panelMap);
      color = blended.rgb + color * (1. - blended.a);
      opacity = blended.a + opacity * (1. - blended.a);
    }


    for (int i = 0; i <= 20; i++) {
      if (i >= panelsNumber) break;

      int idx = panelsNumber - 1 - i;

      float offset = float(idx) / fPanelsNumber;
      if (set == 0) {
        offset += .5;
      }

      float densityFract = densityNormalizer * fract(-t + offset);
      float angleNorm = -densityFract / u_density;
      if (densityFract >= .5 || angleNorm < -.3) continue;

      float smoothDensity = clamp((.5 - densityFract) / .1, 0., 1.) * clamp(densityFract / .01, 0., 1.);
      float smoothAngle = clamp((angleNorm + .3) / .05, 0., 1.);
      if (smoothDensity * smoothAngle < .001) continue;

      vec2 panel = getPanel(angleNorm * TWO_PI + PI, uv, invLength, aa);
      float panelMask = panel[0] * smoothDensity * smoothAngle;
      if (panelMask <= .001) continue;
      float panelMap = panel[1];

      int colorIdx = (colorsCount - (idx % colorsCount)) % colorsCount;
      if (colorIdx < 0) colorIdx += colorsCount;
      int nextColorIdx = (colorIdx + 1) % colorsCount;

      vec4 colorA = premultipliedColors[colorIdx];
      vec4 colorB = premultipliedColors[nextColorIdx];

      colorA = mix(colorA, colorB, max(0., smoothstep(.0, .45, panelMap) - panelGrad));
      vec4 blended = blendColor(colorA, panelMask, panelMap);
      color = blended.rgb + color * (1. - blended.a);
      opacity = blended.a + opacity * (1. - blended.a);
    }
  }

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1.0 - opacity);
  opacity = opacity + u_colorBack.a * (1.0 - opacity);

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}
`,o$={name:"Default",params:{...i.defaultObjectSizing,speed:.5,frame:0,colors:["#ff9d00","#fd4f30","#809bff","#6d2eff","#333aff","#f15cff","#ffd557"],colorBack:"#000000",angle1:0,angle2:0,length:1.1,edges:!1,blur:0,fadeIn:1,fadeOut:.3,gradient:0,density:3,scale:.8}},oL=[o$,{name:"Glass",params:{...i.defaultObjectSizing,rotation:112,speed:1,frame:0,colors:["#00cfff","#ff2d55","#34c759","#af52de"],colorBack:"#ffffff00",angle1:.3,angle2:.3,length:1,edges:!0,blur:.25,fadeIn:.85,fadeOut:.3,gradient:0,density:1.6}},{name:"Gradient",params:{...i.defaultObjectSizing,speed:.5,frame:0,colors:["#f2ff00","#00000000","#00000000","#5a0283","#005eff"],colorBack:"#8ffff2",angle1:.4,angle2:.4,length:3,edges:!1,blur:.5,fadeIn:1,fadeOut:.39,gradient:.78,density:1.65,scale:1.72,rotation:270,offsetX:.18}},{name:"Opening",params:{...i.defaultObjectSizing,speed:2,frame:0,colors:["#00ffff"],colorBack:"#570044",angle1:-1,angle2:-1,length:.52,edges:!1,blur:0,fadeIn:0,fadeOut:1,gradient:0,density:2.21,scale:2.32,rotation:360,offsetX:-.3,offsetY:.6}}],oE=(0,t.memo)(function({speed:o=o$.params.speed,frame:a=o$.params.frame,colors:t=o$.params.colors,colorBack:r=o$.params.colorBack,angle1:l=o$.params.angle1,angle2:n=o$.params.angle2,length:f=o$.params.length,edges:c=o$.params.edges,blur:m=o$.params.blur,fadeIn:p=o$.params.fadeIn,fadeOut:d=o$.params.fadeOut,density:g=o$.params.density,gradient:v=o$.params.gradient,fit:h=o$.params.fit,scale:_=o$.params.scale,rotation:x=o$.params.rotation,originX:y=o$.params.originX,originY:b=o$.params.originY,offsetX:S=o$.params.offsetX,offsetY:C=o$.params.offsetY,worldWidth:w=o$.params.worldWidth,worldHeight:k=o$.params.worldHeight,...z}){let B={u_colors:t.map(s.getShaderColorFromString),u_colorsCount:t.length,u_colorBack:(0,s.getShaderColorFromString)(r),u_angle1:l,u_angle2:n,u_length:f,u_edges:c,u_blur:m,u_fadeIn:p,u_fadeOut:d,u_density:g,u_gradient:v,u_fit:i.ShaderFitOptions[h],u_scale:_,u_rotation:x,u_offsetX:S,u_offsetY:C,u_originX:y,u_originY:b,u_worldWidth:w,u_worldHeight:k};return(0,u.jsx)(e.ShaderMount,{...z,speed:o,frame:a,fragmentShader:oq,uniforms:B})},r.colorPropsAreEqual),oK={maxColorCount:10},oJ=`#version 300 es
precision mediump float;

uniform vec4 u_colors[${oK.maxColorCount}];
uniform float u_colorsCount;

uniform float u_positions;
uniform float u_waveX;
uniform float u_waveXShift;
uniform float u_waveY;
uniform float u_waveYShift;
uniform float u_mixing;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_objectUV;
out vec4 fragColor;

${n.declarePI}
${n.rotation2}
${n.proceduralHash21}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float noise(vec2 n, vec2 seedOffset) {
  return valueNoise(n + seedOffset);
}

vec2 getPosition(int i, float t) {
  float a = float(i) * .37;
  float b = .6 + mod(float(i), 3.) * .3;
  float c = .8 + mod(float(i + 1), 4.) * 0.25;

  float x = sin(t * b + a);
  float y = cos(t * c + a * 1.5);

  return .5 + .5 * vec2(x, y);
}

void main() {
  vec2 uv = v_objectUV;
  uv += .5;
  vec2 grainUV = uv * 1000.;

  float grain = noise(grainUV, vec2(0.));
  float mixerGrain = .4 * u_grainMixer * (grain - .5);

  float radius = smoothstep(0., 1., length(uv - .5));
  float center = 1. - radius;
  for (float i = 1.; i <= 2.; i++) {
    uv.x += u_waveX * center / i * cos(TWO_PI * u_waveXShift + i * 2. * smoothstep(.0, 1., uv.y));
    uv.y += u_waveY * center / i * cos(TWO_PI * u_waveYShift + i * 2. * smoothstep(.0, 1., uv.x));
  }

  vec3 color = vec3(0.);
  float opacity = 0.;
  float totalWeight = 0.;
  float positionSeed = 25. + .33 * u_positions;

  for (int i = 0; i < ${oK.maxColorCount}; i++) {
    if (i >= int(u_colorsCount)) break;

    vec2 pos = getPosition(i, positionSeed) + mixerGrain;
    float dist = length(uv - pos);
    dist = length(uv - pos);

    vec3 colorFraction = u_colors[i].rgb * u_colors[i].a;
    float opacityFraction = u_colors[i].a;

    float mixing = pow(u_mixing, .7);
    float power = mix(2., 1., mixing);
    dist = pow(dist, power);

    float w = 1. / (dist + 1e-3);
    float baseSharpness = mix(.0, 8., clamp(w, 0., 1.));
    float sharpness = mix(baseSharpness, 1., mixing);
    w = pow(w, sharpness);
    color += colorFraction * w;
    opacity += opacityFraction * w;
    totalWeight += w;
  }

  color /= max(1e-4, totalWeight);
  opacity /= max(1e-4, totalWeight);

  float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
  grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
  grainOverlay = pow(grainOverlay, 1.3);

  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  color = mix(color, grainOverlayColor, .35 * grainOverlayStrength);

  opacity += .5 * grainOverlayStrength;
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`,oQ={name:"Default",params:{...i.defaultObjectSizing,rotation:270,speed:0,frame:0,colors:["#ffad0a","#6200ff","#e2a3ff","#ff99fd"],positions:2,waveX:1,waveXShift:.6,waveY:1,waveYShift:.21,mixing:.93,grainMixer:0,grainOverlay:0}},oZ={name:"Sea",params:{...i.defaultObjectSizing,speed:0,frame:0,colors:["#013b65","#03738c","#a3d3ff","#f2faef"],positions:0,waveX:.53,waveXShift:0,waveY:.95,waveYShift:.64,mixing:.5,grainMixer:0,grainOverlay:0}},o0=[oQ,{name:"1960s",params:{...i.defaultObjectSizing,speed:0,frame:0,colors:["#000000","#082400","#b1aa91","#8e8c15"],positions:42,waveX:.45,waveXShift:0,waveY:1,waveYShift:0,mixing:0,grainMixer:.37,grainOverlay:.78}},{name:"Sunset",params:{...i.defaultObjectSizing,speed:0,frame:0,colors:["#264653","#9c2b2b","#f4a261","#ffffff"],positions:0,waveX:.6,waveXShift:.7,waveY:.7,waveYShift:.7,mixing:.5,grainMixer:0,grainOverlay:0}},oZ],o1=(0,t.memo)(function({speed:o=oQ.params.speed,frame:a=oQ.params.frame,colors:t=oQ.params.colors,positions:r=oQ.params.positions,waveX:l=oQ.params.waveX,waveXShift:n=oQ.params.waveXShift,waveY:f=oQ.params.waveY,waveYShift:c=oQ.params.waveYShift,mixing:m=oQ.params.mixing,grainMixer:p=oQ.params.grainMixer,grainOverlay:d=oQ.params.grainOverlay,fit:g=oQ.params.fit,rotation:v=oQ.params.rotation,scale:h=oQ.params.scale,originX:_=oQ.params.originX,originY:x=oQ.params.originY,offsetX:y=oQ.params.offsetX,offsetY:b=oQ.params.offsetY,worldWidth:S=oQ.params.worldWidth,worldHeight:C=oQ.params.worldHeight,...w}){let k={u_colors:t.map(s.getShaderColorFromString),u_colorsCount:t.length,u_positions:r,u_waveX:l,u_waveXShift:n,u_waveY:f,u_waveYShift:c,u_mixing:m,u_grainMixer:p,u_grainOverlay:d,u_fit:i.ShaderFitOptions[g],u_rotation:v,u_scale:h,u_offsetX:y,u_offsetY:b,u_originX:_,u_originY:x,u_worldWidth:S,u_worldHeight:C};return(0,u.jsx)(e.ShaderMount,{...w,speed:o,frame:a,fragmentShader:oJ,uniforms:k})},r.colorPropsAreEqual),o2={maxColorCount:10},o5=`#version 300 es
precision mediump float;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${o2.maxColorCount}];
uniform float u_colorsCount;

uniform float u_radius;
uniform float u_focalDistance;
uniform float u_focalAngle;
uniform float u_falloff;
uniform float u_mixing;
uniform float u_distortion;
uniform float u_distortionShift;
uniform float u_distortionFreq;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_objectUV;
out vec4 fragColor;

${n.declarePI}
${n.rotation2}
${n.proceduralHash21}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float noise(vec2 n, vec2 seedOffset) {
  return valueNoise(n + seedOffset);
}

vec2 getPosition(int i, float t) {
  float a = float(i) * .37;
  float b = .6 + mod(float(i), 3.) * .3;
  float c = .8 + mod(float(i + 1), 4.) * 0.25;

  float x = sin(t * b + a);
  float y = cos(t * c + a * 1.5);

  return .5 + .5 * vec2(x, y);
}

void main() {
  vec2 uv = 2. * v_objectUV;
  vec2 grainUV = uv * 1000.;

  vec2 center = vec2(0.);
  float angleRad = -radians(u_focalAngle + 90.);
  vec2 focalPoint = vec2(cos(angleRad), sin(angleRad)) * u_focalDistance;
  float radius = u_radius;

  vec2 c_to_uv = uv - center;
  vec2 f_to_uv = uv - focalPoint;
  vec2 f_to_c = center - focalPoint;
  float r = length(c_to_uv);

  float fragAngle = atan(c_to_uv.y, c_to_uv.x);
  float angleDiff = fract((fragAngle - angleRad + PI) / TWO_PI) * TWO_PI - PI;

  float halfAngle = acos(clamp(radius / max(u_focalDistance, 1e-4), 0.0, 1.0));
  float e0 = 0.6 * PI, e1 = halfAngle;
  float lo = min(e0, e1), hi = max(e0, e1);
  float s  = smoothstep(lo, hi, abs(angleDiff));
  float isInSector = (e1 >= e0) ? (1.0 - s) : s;

  float a = dot(f_to_uv, f_to_uv);
  float b = -2.0 * dot(f_to_uv, f_to_c);
  float c = dot(f_to_c, f_to_c) - radius * radius;

  float discriminant = b * b - 4.0 * a * c;
  float t = 1.0;

  if (discriminant >= 0.0) {
    float sqrtD = sqrt(discriminant);
    float div = max(1e-4, 2.0 * a);
    float t0 = (-b - sqrtD) / div;
    float t1 = (-b + sqrtD) / div;
    t = max(t0, t1);
    if (t < 0.0) t = 0.0;
  }

  float dist = length(f_to_uv);
  float normalized = dist / max(1e-4, length(f_to_uv * t));
  float shape = clamp(normalized, 0.0, 1.0);

  float falloffMapped = mix(.2 + .8 * max(0., u_falloff + 1.), mix(1., 15., u_falloff * u_falloff), step(.0, u_falloff));

  float falloffExp = mix(falloffMapped, 1., shape);
  shape = pow(shape, falloffExp);
  shape = 1. - clamp(shape, 0., 1.);


  float outerMask = .002;
  float outer = 1.0 - smoothstep(radius - outerMask, radius + outerMask, r);
  outer = mix(outer, 1., isInSector);

  shape = mix(0., shape, outer);
  shape *= 1. - smoothstep(radius - .01, radius, r);

  float angle = atan(f_to_uv.y, f_to_uv.x);
  shape -= pow(u_distortion, 2.) * shape * pow(abs(sin(PI * clamp(length(f_to_uv) - 0.2 + u_distortionShift, 0.0, 1.0))), 4.0) * (sin(u_distortionFreq * angle) + cos(floor(0.65 * u_distortionFreq) * angle));

  float grain = noise(grainUV, vec2(0.));
  float mixerGrain = .4 * u_grainMixer * (grain - .5);

  float mixer = shape * u_colorsCount + mixerGrain;
  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;

  float outerShape = 0.;
  for (int i = 1; i < ${o2.maxColorCount+1}; i++) {
    if (i > int(u_colorsCount)) break;
    float mLinear = clamp(mixer - float(i - 1), 0.0, 1.0);

    float aa = fwidth(mLinear);
    float width = min(u_mixing, 0.5);
    float t = clamp((mLinear - (0.5 - width - aa)) / (2. * width + 2. * aa), 0., 1.);
    float p = mix(2., 1., clamp((u_mixing - 0.5) * 2., 0., 1.));
    float m = t < 0.5
      ? 0.5 * pow(2. * t, p)
      : 1. - 0.5 * pow(2. * (1. - t), p);

    float quadBlend = clamp((u_mixing - 0.5) * 2., 0., 1.);
    m = mix(m, m * m, 0.5 * quadBlend);
    
    if (i == 1) {
      outerShape = m;
    }

    vec4 c = u_colors[i - 1];
    c.rgb *= c.a;
    gradient = mix(gradient, c, m);
  }

  vec3 color = gradient.rgb * outerShape;
  float opacity = gradient.a * outerShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1.0 - opacity);
  opacity = opacity + u_colorBack.a * (1.0 - opacity);

  float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
  grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
  grainOverlay = pow(grainOverlay, 1.3);

  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  color = mix(color, grainOverlayColor, .35 * grainOverlayStrength);

  opacity += .5 * grainOverlayStrength;
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`,o3={name:"Default",params:{...i.defaultObjectSizing,scale:1,speed:0,frame:0,colorBack:"#000000",colors:["#00bbff","#00ffe1","#ffffff"],radius:.8,focalDistance:.99,focalAngle:0,falloff:.24,mixing:.5,distortion:0,distortionShift:0,distortionFreq:12,grainMixer:0,grainOverlay:0}},o4={name:"Cross Section",params:{...i.defaultObjectSizing,scale:1,speed:0,frame:0,colorBack:"#3d348b",colors:["#7678ed","#f7b801","#f18701","#37a066"],radius:1,focalDistance:0,focalAngle:0,falloff:0,mixing:0,distortion:1,distortionShift:0,distortionFreq:12,grainMixer:0,grainOverlay:0}},o6={name:"Radial",params:{...i.defaultObjectSizing,scale:1,speed:0,frame:0,colorBack:"#264653",colors:["#9c2b2b","#f4a261","#ffffff"],radius:1,focalDistance:0,focalAngle:0,falloff:0,mixing:1,distortion:0,distortionShift:0,distortionFreq:12,grainMixer:0,grainOverlay:0}},o8=[o3,{name:"Lo-Fi",params:{...i.defaultObjectSizing,speed:0,frame:0,colorBack:"#2e1f27",colors:["#d72638","#3f88c5","#f49d37"],radius:1,focalDistance:0,focalAngle:0,falloff:.9,mixing:.7,distortion:0,distortionShift:0,distortionFreq:12,grainMixer:1,grainOverlay:.5}},o4,o6],o9=(0,t.memo)(function({speed:o=o3.params.speed,frame:a=o3.params.frame,colorBack:t=o3.params.colorBack,colors:r=o3.params.colors,radius:l=o3.params.radius,focalDistance:n=o3.params.focalDistance,focalAngle:f=o3.params.focalAngle,falloff:c=o3.params.falloff,grainMixer:m=o3.params.grainMixer,mixing:p=o3.params.mixing,distortion:d=o3.params.distortion,distortionShift:g=o3.params.distortionShift,distortionFreq:v=o3.params.distortionFreq,grainOverlay:h=o3.params.grainOverlay,fit:_=o3.params.fit,rotation:x=o3.params.rotation,scale:y=o3.params.scale,originX:b=o3.params.originX,originY:S=o3.params.originY,offsetX:C=o3.params.offsetX,offsetY:w=o3.params.offsetY,worldWidth:k=o3.params.worldWidth,worldHeight:z=o3.params.worldHeight,...B}){let O={u_colorBack:(0,s.getShaderColorFromString)(t),u_colors:r.map(s.getShaderColorFromString),u_colorsCount:r.length,u_radius:l,u_focalDistance:n,u_focalAngle:f,u_falloff:c,u_mixing:p,u_distortion:d,u_distortionShift:g,u_distortionFreq:v,u_grainMixer:m,u_grainOverlay:h,u_fit:i.ShaderFitOptions[_],u_rotation:x,u_scale:y,u_offsetX:C,u_offsetY:w,u_originX:b,u_originY:S,u_worldWidth:k,u_worldHeight:z};return(0,u.jsx)(e.ShaderMount,{...B,speed:o,frame:a,fragmentShader:o5,uniforms:O})},r.colorPropsAreEqual),o7=`#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform vec4 u_colorFront;
uniform vec4 u_colorBack;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_contrast;
uniform float u_roughness;
uniform float u_fiber;
uniform float u_fiberSize;
uniform float u_crumples;
uniform float u_crumpleSize;
uniform float u_folds;
uniform float u_foldCount;
uniform float u_drops;
uniform float u_seed;
uniform float u_fade;

uniform sampler2D u_noiseTexture;

in vec2 v_imageUV;

out vec4 fragColor;

float getUvFrame(vec2 uv) {
  float aax = 2. * fwidth(uv.x);
  float aay = 2. * fwidth(uv.y);

  float left   = smoothstep(0., aax, uv.x);
  float right = 1. - smoothstep(1. - aax, 1., uv.x);
  float bottom = smoothstep(0., aay, uv.y);
  float top = 1. - smoothstep(1. - aay, 1., uv.y);

  return left * right * bottom * top;
}

${n.declarePI}
${n.rotation2}
${n.textureRandomizerR}
float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomR(i);
  float b = randomR(i + vec2(1.0, 0.0));
  float c = randomR(i + vec2(0.0, 1.0));
  float d = randomR(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}
float fbm(vec2 n) {
  float total = 0.0, amplitude = .4;
  for (int i = 0; i < 3; i++) {
    total += valueNoise(n) * amplitude;
    n *= 1.99;
    amplitude *= 0.65;
  }
  return total;
}


float randomG(vec2 p) {
  vec2 uv = floor(p) / 50. + .5;
  return texture(u_noiseTexture, fract(uv)).g;
}
float roughness(vec2 p) {
  p *= .1;
  float o = 0.;
  for (float i = 0.; ++i < 4.; p *= 2.1) {
    vec4 w = vec4(floor(p), ceil(p));
    vec2 f = fract(p);
    o += mix(
    mix(randomG(w.xy), randomG(w.xw), f.y),
    mix(randomG(w.zy), randomG(w.zw), f.y),
    f.x);
    o += .2 / exp(2. * abs(sin(.2 * p.x + .5 * p.y)));
  }
  return o / 3.;
}

${n.fiberNoise}

vec2 randomGB(vec2 p) {
  vec2 uv = floor(p) / 50. + .5;
  return texture(u_noiseTexture, fract(uv)).gb;
}
float crumpledNoise(vec2 t, float pw) {
  vec2 p = floor(t);
  float wsum = 0.;
  float cl = 0.;
  for (int y = -1; y < 2; y += 1) {
    for (int x = -1; x < 2; x += 1) {
      vec2 b = vec2(float(x), float(y));
      vec2 q = b + p;
      vec2 q2 = q - floor(q / 8.) * 8.;
      vec2 c = q + randomGB(q2);
      vec2 r = c - t;
      float w = pow(smoothstep(0., 1., 1. - abs(r.x)), pw) * pow(smoothstep(0., 1., 1. - abs(r.y)), pw);
      cl += (.5 + .5 * sin((q2.x + q2.y * 5.) * 8.)) * w;
      wsum += w;
    }
  }
  return pow(wsum != 0.0 ? cl / wsum : 0.0, .5) * 2.;
}
float crumplesShape(vec2 uv) {
  return crumpledNoise(uv * .25, 16.) * crumpledNoise(uv * .5, 2.);
}


vec2 folds(vec2 uv) {
  vec3 pp = vec3(0.);
  float l = 9.;
  for (float i = 0.; i < 15.; i++) {
    if (i >= u_foldCount) break;
    vec2 rand = randomGB(vec2(i, i * u_seed));
    float an = rand.x * TWO_PI;
    vec2 p = vec2(cos(an), sin(an)) * rand.y;
    float dist = distance(uv, p);
    l = min(l, dist);

    if (l == dist) {
      pp.xy = (uv - p.xy);
      pp.z = dist;
    }
  }
  return mix(pp.xy, vec2(0.), pow(pp.z, .25));
}

float drops(vec2 uv) {
  vec2 iDropsUV = floor(uv);
  vec2 fDropsUV = fract(uv);
  float dropsMinDist = 1.;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 neighbor = vec2(float(i), float(j));
      vec2 offset = randomGB(iDropsUV + neighbor);
      offset = .5 + .5 * sin(10. * u_seed + TWO_PI * offset);
      vec2 pos = neighbor + offset - fDropsUV;
      float dist = length(pos);
      dropsMinDist = min(dropsMinDist, dropsMinDist*dist);
    }
  }
  return 1. - smoothstep(.05, .09, pow(dropsMinDist, .5));
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

void main() {

  vec2 imageUV = v_imageUV;
  vec2 patternUV = v_imageUV - .5;
  patternUV = 5. * (patternUV * vec2(u_imageAspectRatio, 1.));

  vec2 roughnessUv = 1.5 * (gl_FragCoord.xy - .5 * u_resolution) / u_pixelRatio;
  float roughness = roughness(roughnessUv + vec2(1., 0.)) - roughness(roughnessUv - vec2(1., 0.));

  vec2 crumplesUV = fract(patternUV * .02 / u_crumpleSize - u_seed) * 32.;
  float crumples = u_crumples * (crumplesShape(crumplesUV + vec2(.05, 0.)) - crumplesShape(crumplesUV));

  vec2 fiberUV = 2. / u_fiberSize * patternUV;
  float fiber = fiberNoise(fiberUV, vec2(0.));
  fiber = .5 * u_fiber * (fiber - 1.);

  vec2 normal = vec2(0.);
  vec2 normalImage = vec2(0.);

  vec2 foldsUV = patternUV * .12;
  foldsUV = rotate(foldsUV, 4. * u_seed);
  vec2 w = folds(foldsUV);
  foldsUV = rotate(foldsUV + .007 * cos(u_seed), .01 * sin(u_seed));
  vec2 w2 = folds(foldsUV);

  float drops = u_drops * drops(patternUV * 2.);

  float fade = u_fade * fbm(.17 * patternUV + 10. * u_seed);
  fade = clamp(8. * fade * fade * fade, 0., 1.);

  w = mix(w, vec2(0.), fade);
  w2 = mix(w2, vec2(0.), fade);
  crumples = mix(crumples, 0., fade);
  drops = mix(drops, 0., fade);
  fiber *= mix(1., .5, fade);
  roughness *= mix(1., .5, fade);

  normal.xy += u_folds * min(5. * u_contrast, 1.) * 4. * max(vec2(0.), w + w2);
  normalImage.xy += u_folds * 2. * w;

  normal.xy += crumples;
  normalImage.xy += 1.5 * crumples;

  normal.xy += 3. * drops;
  normalImage.xy += .2 * drops;

  normal.xy += u_roughness * 1.5 * roughness;
  normal.xy += fiber;

  normalImage += u_roughness * .75 * roughness;
  normalImage += .2 * fiber;

  vec3 lightPos = vec3(1., 2., 1.);
  float res = dot(normalize(vec3(normal, 9.5 - 9. * pow(u_contrast, .1))), normalize(lightPos));

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  imageUV += .02 * normalImage;
  float frame = getUvFrame(imageUV);
  vec4 image = texture(u_image, imageUV);
  image.rgb += .6 * pow(u_contrast, .4) * (res - .7);

  frame *= image.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;

  color += bgColor * (1. - opacity);
  opacity += bgOpacity * (1. - opacity);
  opacity = mix(opacity, 1., frame);

  color -= .007 * drops;

  color.rgb = mix(color, image.rgb, frame);

  fragColor = vec4(color, opacity);
}
`,eo={name:"Default",params:{...i.defaultObjectSizing,fit:"cover",scale:.6,speed:0,frame:0,colorFront:"#9fadbc",colorBack:"#ffffff",contrast:.3,roughness:.4,fiber:.3,fiberSize:.2,crumples:.3,crumpleSize:.35,folds:.65,foldCount:5,fade:0,drops:.2,seed:5.8}},ee={name:"Abstract",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,scale:.6,colorFront:"#00eeff",colorBack:"#ff0a81",contrast:.85,roughness:0,fiber:.1,fiberSize:.2,crumples:0,crumpleSize:.3,folds:1,foldCount:3,fade:0,drops:.2,seed:2.2}},ea=[eo,{name:"Cardboard",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,scale:.6,colorFront:"#c7b89e",colorBack:"#999180",contrast:.4,roughness:0,fiber:.35,fiberSize:.14,crumples:.7,crumpleSize:.1,folds:0,foldCount:1,fade:0,drops:.1,seed:1.6}},ee,{name:"Details",params:{...i.defaultObjectSizing,speed:0,frame:0,fit:"cover",scale:3,colorFront:"#00000000",colorBack:"#00000000",contrast:0,roughness:1,fiber:.27,fiberSize:.22,crumples:1,crumpleSize:.5,folds:1,foldCount:15,fade:0,drops:0,seed:6}}],et=(0,t.memo)(function({speed:o=eo.params.speed,frame:a=eo.params.frame,colorFront:t=eo.params.colorFront,colorBack:r=eo.params.colorBack,image:n="",contrast:f=eo.params.contrast,roughness:c=eo.params.roughness,fiber:m=eo.params.fiber,crumples:p=eo.params.crumples,folds:d=eo.params.folds,drops:g=eo.params.drops,seed:v=eo.params.seed,fiberScale:h,fiberSize:_=void 0===h?eo.params.fiberSize:.2/h,crumplesScale:x,crumpleSize:y=void 0===x?eo.params.crumpleSize:.2/x,blur:b,fade:S=void 0===b?eo.params.fade:b,foldsNumber:C,foldCount:w=void 0===C?eo.params.foldCount:C,fit:k=eo.params.fit,scale:z=eo.params.scale,rotation:B=eo.params.rotation,originX:O=eo.params.originX,originY:F=eo.params.originY,offsetX:U=eo.params.offsetX,offsetY:V=eo.params.offsetY,worldWidth:R=eo.params.worldWidth,worldHeight:M=eo.params.worldHeight,...P}){let Y="u">typeof window&&{u_noiseTexture:(0,l.getShaderNoiseTexture)()},I={u_image:n,u_colorFront:(0,s.getShaderColorFromString)(t),u_colorBack:(0,s.getShaderColorFromString)(r),u_contrast:f,u_roughness:c,u_fiber:m,u_fiberSize:_,u_crumples:p,u_crumpleSize:y,u_foldCount:w,u_folds:d,u_fade:S,u_drops:g,u_seed:v,...Y,u_fit:i.ShaderFitOptions[k],u_scale:z,u_rotation:B,u_offsetX:U,u_offsetY:V,u_originX:O,u_originY:F,u_worldWidth:R,u_worldHeight:M};return(0,u.jsx)(e.ShaderMount,{...P,speed:o,frame:a,fragmentShader:o7,mipmaps:["u_image"],uniforms:I})},r.colorPropsAreEqual),er=`#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_rotation;

uniform vec4 u_colorBack;
uniform vec4 u_colorShadow;
uniform vec4 u_colorHighlight;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_size;
uniform float u_shadows;
uniform float u_angle;
uniform float u_stretch;
uniform float u_shape;
uniform float u_distortion;
uniform float u_highlights;
uniform float u_distortionShape;
uniform float u_shift;
uniform float u_blur;
uniform float u_edges;
uniform float u_marginLeft;
uniform float u_marginRight;
uniform float u_marginTop;
uniform float u_marginBottom;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_imageUV;

out vec4 fragColor;

${n.declarePI}
${n.rotation2}
${n.proceduralHash21}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float getUvFrame(vec2 uv, float softness) {
  float aax = 2. * fwidth(uv.x);
  float aay = 2. * fwidth(uv.y);
  float left   = smoothstep(0., aax + softness, uv.x);
  float right  = 1. - smoothstep(1. - softness - aax, 1., uv.x);
  float bottom = smoothstep(0., aay + softness, uv.y);
  float top    = 1. - smoothstep(1. - softness - aay, 1., uv.y);
  return left * right * bottom * top;
}

const int MAX_RADIUS = 50;
vec4 samplePremultiplied(sampler2D tex, vec2 uv) {
  vec4 c = texture(tex, uv);
  c.rgb *= c.a;
  return c;
}
vec4 getBlur(sampler2D tex, vec2 uv, vec2 texelSize, vec2 dir, float sigma) {
  if (sigma <= .5) return texture(tex, uv);
  int radius = int(min(float(MAX_RADIUS), ceil(3.0 * sigma)));

  float twoSigma2 = 2.0 * sigma * sigma;
  float gaussianNorm = 1.0 / sqrt(TWO_PI * sigma * sigma);

  vec4 sum = samplePremultiplied(tex, uv) * gaussianNorm;
  float weightSum = gaussianNorm;

  for (int i = 1; i <= MAX_RADIUS; i++) {
    if (i > radius) break;

    float x = float(i);
    float w = exp(-(x * x) / twoSigma2) * gaussianNorm;

    vec2 offset = dir * texelSize * x;
    vec4 s1 = samplePremultiplied(tex, uv + offset);
    vec4 s2 = samplePremultiplied(tex, uv - offset);

    sum += (s1 + s2) * w;
    weightSum += 2.0 * w;
  }

  vec4 result = sum / weightSum;
  if (result.a > 0.) {
    result.rgb /= result.a;
  }

  return result;
}

vec2 rotateAspect(vec2 p, float a, float aspect) {
  p.x *= aspect;
  p = rotate(p, a);
  p.x /= aspect;
  return p;
}

float smoothFract(float x) {
  float f = fract(x);
  float w = fwidth(x);

  float edge = abs(f - 0.5) - 0.5;
  float band = smoothstep(-w, w, edge);

  return mix(f, 1.0 - f, band);
}

void main() {

  float patternRotation = -u_angle * PI / 180.;
  float patternSize = mix(200., 5., u_size);

  vec2 uv = v_imageUV;

  vec2 uvMask = gl_FragCoord.xy / u_resolution.xy;
  vec2 sw = vec2(.005);
  vec4 margins = vec4(u_marginLeft, u_marginTop, u_marginRight, u_marginBottom);
  float mask =
  smoothstep(margins[0], margins[0] + sw.x, uvMask.x + sw.x) *
  smoothstep(margins[2], margins[2] + sw.x, 1.0 - uvMask.x + sw.x) *
  smoothstep(margins[1], margins[1] + sw.y, uvMask.y + sw.y) *
  smoothstep(margins[3], margins[3] + sw.y, 1.0 - uvMask.y + sw.y);
  float maskOuter =
  smoothstep(margins[0] - sw.x, margins[0], uvMask.x + sw.x) *
  smoothstep(margins[2] - sw.x, margins[2], 1.0 - uvMask.x + sw.x) *
  smoothstep(margins[1] - sw.y, margins[1], uvMask.y + sw.y) *
  smoothstep(margins[3] - sw.y, margins[3], 1.0 - uvMask.y + sw.y);
  float maskStroke = maskOuter - mask;
  float maskInner =
  smoothstep(margins[0] - 2. * sw.x, margins[0], uvMask.x) *
  smoothstep(margins[2] - 2. * sw.x, margins[2], 1.0 - uvMask.x) *
  smoothstep(margins[1] - 2. * sw.y, margins[1], uvMask.y) *
  smoothstep(margins[3] - 2. * sw.y, margins[3], 1.0 - uvMask.y);
  float maskStrokeInner = maskInner - mask;

  uv -= .5;
  uv *= patternSize;
  uv = rotateAspect(uv, patternRotation, u_imageAspectRatio);

  float curve = 0.;
  float patternY = uv.y / u_imageAspectRatio;
  if (u_shape > 4.5) {
    // pattern
    curve = .5 + .5 * sin(.5 * PI * uv.x) * cos(.5 * PI * patternY);
  } else if (u_shape > 3.5) {
    // zigzag
    curve = 10. * abs(fract(.1 * patternY) - .5);
  } else if (u_shape > 2.5) {
    // wave
    curve = 4. * sin(.23 * patternY);
  } else if (u_shape > 1.5) {
    // lines irregular
    curve = .5 + .5 * sin(.5 * uv.x) * sin(1.7 * uv.x);
  } else {
    // lines
  }

  vec2 UvToFract = uv + curve;
  vec2 fractOrigUV = fract(uv);
  vec2 floorOrigUV = floor(uv);

  float x = smoothFract(UvToFract.x);
  float xNonSmooth = fract(UvToFract.x) + .0001;

  float highlightsWidth = 2. * max(.001, fwidth(UvToFract.x));
  highlightsWidth += 2. * maskStrokeInner;
  float highlights = smoothstep(0., highlightsWidth, xNonSmooth);
  highlights *= smoothstep(1., 1. - highlightsWidth, xNonSmooth);
  highlights = 1. - highlights;
  highlights *= u_highlights;
  highlights = clamp(highlights, 0., 1.);
  highlights *= mask;

  float shadows = pow(x, 1.3);
  float distortion = 0.;
  float fadeX = 1.;
  float frameFade = 0.;

  float aa = fwidth(xNonSmooth);
  aa = max(aa, fwidth(uv.x));
  aa = max(aa, fwidth(UvToFract.x));
  aa = max(aa, .0001);

  if (u_distortionShape == 1.) {
    distortion = -pow(1.5 * x, 3.);
    distortion += (.5 - u_shift);

    frameFade = pow(1.5 * x, 3.);
    aa = max(.2, aa);
    aa += mix(.2, 0., u_size);
    fadeX = smoothstep(0., aa, xNonSmooth) * smoothstep(1., 1. - aa, xNonSmooth);
    distortion = mix(.5, distortion, fadeX);
  } else if (u_distortionShape == 2.) {
    distortion = 2. * pow(x, 2.);
    distortion -= (.5 + u_shift);

    frameFade = pow(abs(x - .5), 4.);
    aa = max(.2, aa);
    aa += mix(.2, 0., u_size);
    fadeX = smoothstep(0., aa, xNonSmooth) * smoothstep(1., 1. - aa, xNonSmooth);
    distortion = mix(.5, distortion, fadeX);
    frameFade = mix(1., frameFade, .5 * fadeX);
  } else if (u_distortionShape == 3.) {
    distortion = pow(2. * (xNonSmooth - .5), 6.);
    distortion -= .25;
    distortion -= u_shift;

    frameFade = 1. - 2. * pow(abs(x - .4), 2.);
    aa = .15;
    aa += mix(.1, 0., u_size);
    fadeX = smoothstep(0., aa, xNonSmooth) * smoothstep(1., 1. - aa, xNonSmooth);
    frameFade = mix(1., frameFade, fadeX);

  } else if (u_distortionShape == 4.) {
    x = xNonSmooth;
    distortion = sin((x + .25) * TWO_PI);
    shadows = .5 + .5 * asin(distortion) / (.5 * PI);
    distortion *= .5;
    distortion -= u_shift;
    frameFade = .5 + .5 * sin(x * TWO_PI);
  } else if (u_distortionShape == 5.) {
    distortion -= pow(abs(x), .2) * x;
    distortion += .33;
    distortion -= 3. * u_shift;
    distortion *= .33;

    frameFade = .3 * (smoothstep(.0, 1., x));
    shadows = pow(x, 2.5);

    aa = max(.1, aa);
    aa += mix(.1, 0., u_size);
    fadeX = smoothstep(0., aa, xNonSmooth) * smoothstep(1., 1. - aa, xNonSmooth);
    distortion *= fadeX;
  }

  vec2 dudx = dFdx(v_imageUV);
  vec2 dudy = dFdy(v_imageUV);
  vec2 grainUV = v_imageUV - .5;
  grainUV *= (.8 / vec2(length(dudx), length(dudy)));
  grainUV += .5;
  float grain = valueNoise(grainUV);
  grain = smoothstep(.4, .7, grain);
  grain *= u_grainMixer;
  distortion = mix(distortion, 0., grain);

  shadows = min(shadows, 1.);
  shadows += maskStrokeInner;
  shadows *= mask;
  shadows = min(shadows, 1.);
  shadows *= pow(u_shadows, 2.);
  shadows = clamp(shadows, 0., 1.);

  distortion *= 3. * u_distortion;
  frameFade *= u_distortion;

  fractOrigUV.x += distortion;
  floorOrigUV = rotateAspect(floorOrigUV, -patternRotation, u_imageAspectRatio);
  fractOrigUV = rotateAspect(fractOrigUV, -patternRotation, u_imageAspectRatio);

  uv = (floorOrigUV + fractOrigUV) / patternSize;
  uv += pow(maskStroke, 4.);

  uv += vec2(.5);

  uv = mix(v_imageUV, uv, smoothstep(0., .7, mask));
  float blur = mix(0., 50., u_blur);
  blur = mix(0., blur, smoothstep(.5, 1., mask));

  float edgeDistortion = mix(.0, .04, u_edges);
  edgeDistortion += .06 * frameFade * u_edges;
  edgeDistortion *= mask;
  float frame = getUvFrame(uv, edgeDistortion);

  float stretch = 1. - smoothstep(0., .5, xNonSmooth) * smoothstep(1., 1. - .5, xNonSmooth);
  stretch = pow(stretch, 2.);
  stretch *= mask;
  stretch *= getUvFrame(uv, .1 + .05 * mask * frameFade);
  uv.y = mix(uv.y, .5, u_stretch * stretch);

  vec4 image = getBlur(u_image, uv, 1. / u_resolution / u_pixelRatio, vec2(0., 1.), blur);
  image.rgb *= image.a;
  vec4 backColor = u_colorBack;
  backColor.rgb *= backColor.a;
  vec4 highlightColor = u_colorHighlight;
  highlightColor.rgb *= highlightColor.a;
  vec4 shadowColor = u_colorShadow;

  vec3 color = highlightColor.rgb * highlights;
  float opacity = highlightColor.a * highlights;

  shadows = mix(shadows * shadowColor.a, 0., highlights);
  color = mix(color, shadowColor.rgb * shadowColor.a, .5 * shadows);
  color += .5 * pow(shadows, .5) * shadowColor.rgb;
  opacity += shadows;
  color = clamp(color, vec3(0.), vec3(1.));
  opacity = clamp(opacity, 0., 1.);

  color += image.rgb * (1. - opacity) * frame;
  opacity += image.a * (1. - opacity) * frame;

  color += backColor.rgb * (1. - opacity);
  opacity += backColor.a * (1. - opacity);

  float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
  grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
  grainOverlay = pow(grainOverlay, 1.3);

  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  grainOverlayStrength *= mask;
  color = mix(color, grainOverlayColor, .35 * grainOverlayStrength);

  opacity += .5 * grainOverlayStrength;
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`,ei={lines:1,linesIrregular:2,wave:3,zigzag:4,pattern:5},es={prism:1,lens:2,contour:3,cascade:4,flat:5},el={name:"Default",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,colorBack:"#00000000",colorShadow:"#000000",colorHighlight:"#ffffff",shadows:.25,size:.5,angle:0,distortionShape:"prism",highlights:.1,shape:"lines",distortion:.5,shift:0,blur:0,edges:.25,stretch:0,margin:0,marginLeft:0,marginRight:0,marginTop:0,marginBottom:0,grainMixer:0,grainOverlay:0}},en={name:"Waves",params:{...i.defaultObjectSizing,fit:"cover",scale:1.2,speed:0,frame:0,colorBack:"#00000000",colorShadow:"#000000",colorHighlight:"#ffffff",shadows:0,size:.9,angle:0,distortionShape:"contour",highlights:0,shape:"wave",distortion:.5,shift:0,blur:.1,edges:.5,stretch:1,margin:0,marginLeft:0,marginRight:0,marginTop:0,marginBottom:0,grainMixer:0,grainOverlay:.05}},ef=[el,{name:"Abstract",params:{...i.defaultObjectSizing,fit:"cover",scale:4,speed:0,frame:0,colorBack:"#00000000",colorShadow:"#000000",colorHighlight:"#ffffff",shadows:0,size:.7,angle:30,distortionShape:"flat",highlights:0,shape:"linesIrregular",distortion:1,shift:0,blur:1,edges:.5,stretch:1,margin:0,marginLeft:0,marginRight:0,marginTop:0,marginBottom:0,grainMixer:.1,grainOverlay:.1}},en,{name:"Folds",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,colorBack:"#00000000",colorShadow:"#000000",colorHighlight:"#ffffff",shadows:.4,size:.4,angle:0,distortionShape:"cascade",highlights:0,shape:"lines",distortion:.75,shift:0,blur:.25,edges:.5,stretch:0,margin:.1,marginLeft:.1,marginRight:.1,marginTop:.1,marginBottom:.1,grainMixer:0,grainOverlay:0}}],ec=(0,t.memo)(function({speed:o=el.params.speed,frame:a=el.params.frame,colorBack:t=el.params.colorBack,colorShadow:r=el.params.colorShadow,colorHighlight:l=el.params.colorHighlight,image:n="",shadows:f=el.params.shadows,angle:c=el.params.angle,distortion:m=el.params.distortion,distortionShape:p=el.params.distortionShape,highlights:d=el.params.highlights,shape:g=el.params.shape,shift:v=el.params.shift,blur:h=el.params.blur,edges:_=el.params.edges,margin:x,marginLeft:y=x??el.params.marginLeft,marginRight:b=x??el.params.marginRight,marginTop:S=x??el.params.marginTop,marginBottom:C=x??el.params.marginBottom,grainMixer:w=el.params.grainMixer,grainOverlay:k=el.params.grainOverlay,stretch:z=el.params.stretch,count:B,size:O=void 0===B?el.params.size:Math.pow(1/(1.6*B),1/6)/.7-.5,fit:F=el.params.fit,scale:U=el.params.scale,rotation:V=el.params.rotation,originX:R=el.params.originX,originY:M=el.params.originY,offsetX:P=el.params.offsetX,offsetY:Y=el.params.offsetY,worldWidth:I=el.params.worldWidth,worldHeight:A=el.params.worldHeight,...N}){let X={u_image:n,u_colorBack:(0,s.getShaderColorFromString)(t),u_colorShadow:(0,s.getShaderColorFromString)(r),u_colorHighlight:(0,s.getShaderColorFromString)(l),u_shadows:f,u_size:O,u_angle:c,u_distortion:m,u_shift:v,u_blur:h,u_edges:_,u_stretch:z,u_distortionShape:es[p],u_highlights:d,u_shape:ei[g],u_marginLeft:y,u_marginRight:b,u_marginTop:S,u_marginBottom:C,u_grainMixer:w,u_grainOverlay:k,u_fit:i.ShaderFitOptions[F],u_scale:U,u_rotation:V,u_offsetX:P,u_offsetY:Y,u_originX:R,u_originY:M,u_worldWidth:I,u_worldHeight:A};return(0,u.jsx)(e.ShaderMount,{...N,speed:o,frame:a,fragmentShader:er,mipmaps:["u_image"],uniforms:X})}),eu=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorHighlight;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_size;
uniform float u_highlights;
uniform float u_layering;
uniform float u_edges;
uniform float u_caustic;
uniform float u_waves;

in vec2 v_imageUV;

out vec4 fragColor;

${n.declarePI}
${n.rotation2}
${n.simplexNoise}

float getUvFrame(vec2 uv) {
  float aax = 2. * fwidth(uv.x);
  float aay = 2. * fwidth(uv.y);

  float left   = smoothstep(0., aax, uv.x);
  float right = 1.0 - smoothstep(1. - aax, 1., uv.x);
  float bottom = smoothstep(0., aay, uv.y);
  float top = 1.0 - smoothstep(1. - aay, 1., uv.y);

  return left * right * bottom * top;
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float getCausticNoise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 6; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.1;
  }
  return (N.x + N.y + 1.);
}

void main() {
  vec2 imageUV = v_imageUV;
  vec2 patternUV = v_imageUV - .5;
  patternUV = (patternUV * vec2(u_imageAspectRatio, 1.));
  patternUV /= (.01 + .09 * u_size);

  float t = u_time;

  float wavesNoise = snoise((.3 + .1 * sin(t)) * .1 * patternUV + vec2(0., .4 * t));

  float causticNoise = getCausticNoise(patternUV + u_waves * vec2(1., -1.) * wavesNoise, 2. * t, 1.5);

  causticNoise += u_layering * getCausticNoise(patternUV + 2. * u_waves * vec2(1., -1.) * wavesNoise, 1.5 * t, 2.);
  causticNoise = causticNoise * causticNoise;

  float edgesDistortion = smoothstep(0., .1, imageUV.x);
  edgesDistortion *= smoothstep(0., .1, imageUV.y);
  edgesDistortion *= (smoothstep(1., 1.1, imageUV.x) + (1.0 - smoothstep(.8, .95, imageUV.x)));
  edgesDistortion *= (1.0 - smoothstep(.9, 1., imageUV.y));
  edgesDistortion = mix(edgesDistortion, 1., u_edges);

  float causticNoiseDistortion = .02 * causticNoise * edgesDistortion;

  float wavesDistortion = .1 * u_waves * wavesNoise;

  imageUV += vec2(wavesDistortion, -wavesDistortion);
  imageUV += (u_caustic * causticNoiseDistortion);

  float frame = getUvFrame(imageUV);

  vec4 image = texture(u_image, imageUV);
  vec4 backColor = u_colorBack;
  backColor.rgb *= backColor.a;

  vec3 color = mix(backColor.rgb, image.rgb, image.a * frame);
  float opacity = backColor.a + image.a * frame;

  causticNoise = max(-.2, causticNoise);

  float hightlight = .025 * u_highlights * causticNoise;
  hightlight *= u_colorHighlight.a;
  color = mix(color, u_colorHighlight.rgb, .05 * u_highlights * causticNoise);
  opacity += hightlight;

  color += hightlight * (.5 + .5 * wavesNoise);
  opacity += hightlight * (.5 + .5 * wavesNoise);

  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`,em={name:"Default",params:{...i.defaultObjectSizing,scale:.8,speed:1,frame:0,colorBack:"#909090",colorHighlight:"#ffffff",highlights:.07,layering:.5,edges:.8,waves:.3,caustic:.1,size:1}},ep={name:"Abstract",params:{...i.defaultObjectSizing,fit:"cover",scale:3,speed:1,frame:0,colorBack:"#909090",colorHighlight:"#ffffff",highlights:0,layering:0,edges:1,waves:1,caustic:.4,size:.15}},ed={name:"Streaming",params:{...i.defaultObjectSizing,fit:"contain",scale:.4,speed:2,frame:0,colorBack:"#909090",colorHighlight:"#ffffff",highlights:0,layering:0,edges:0,waves:.5,caustic:0,size:.5}},eg=[em,{name:"Slow-mo",params:{...i.defaultObjectSizing,fit:"cover",scale:1,speed:.1,frame:0,colorBack:"#909090",colorHighlight:"#ffffff",highlights:.4,layering:0,edges:0,waves:0,caustic:.2,size:.7}},ep,ed],ev=(0,t.memo)(function({speed:o=em.params.speed,frame:a=em.params.frame,colorBack:t=em.params.colorBack,colorHighlight:r=em.params.colorHighlight,image:l="",highlights:n=em.params.highlights,layering:f=em.params.layering,waves:c=em.params.waves,edges:m=em.params.edges,caustic:p=em.params.caustic,effectScale:d,size:g=void 0===d?em.params.size:10/9/d-1/9,fit:v=em.params.fit,scale:h=em.params.scale,rotation:_=em.params.rotation,originX:x=em.params.originX,originY:y=em.params.originY,offsetX:b=em.params.offsetX,offsetY:S=em.params.offsetY,worldWidth:C=em.params.worldWidth,worldHeight:w=em.params.worldHeight,...k}){let z={u_image:l,u_colorBack:(0,s.getShaderColorFromString)(t),u_colorHighlight:(0,s.getShaderColorFromString)(r),u_highlights:n,u_layering:f,u_waves:c,u_edges:m,u_caustic:p,u_size:g,u_fit:i.ShaderFitOptions[v],u_rotation:_,u_scale:h,u_offsetX:b,u_offsetY:S,u_originX:x,u_originY:y,u_worldWidth:C,u_worldHeight:w};return(0,u.jsx)(e.ShaderMount,{...k,speed:o,frame:a,fragmentShader:eu,mipmaps:["u_image"],uniforms:z})},r.colorPropsAreEqual),eh=`#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;

uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

uniform vec4 u_colorFront;
uniform vec4 u_colorBack;
uniform vec4 u_colorHighlight;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_type;
uniform float u_pxSize;
uniform bool u_originalColors;
uniform bool u_inverted;
uniform float u_colorSteps;

out vec4 fragColor;


${n.proceduralHash21}
${n.declarePI}

float getUvFrame(vec2 uv, vec2 pad) {
  float aa = 0.0001;

  float left   = smoothstep(-pad.x, -pad.x + aa, uv.x);
  float right  = smoothstep(1.0 + pad.x, 1.0 + pad.x - aa, uv.x);
  float bottom = smoothstep(-pad.y, -pad.y + aa, uv.y);
  float top    = smoothstep(1.0 + pad.y, 1.0 + pad.y - aa, uv.y);

  return left * right * bottom * top;
}

vec2 getImageUV(vec2 uv) {
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  float r = u_rotation * PI / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  vec2 imageUV = uv;
  imageUV *= imageBoxScale;
  imageUV += boxOrigin * (imageBoxScale - 1.);
  imageUV += graphicOffset;
  imageUV /= u_scale;
  imageUV.x *= u_imageAspectRatio;
  imageUV = graphicRotation * imageUV;
  imageUV.x /= u_imageAspectRatio;

  imageUV += .5;
  imageUV.y = 1. - imageUV.y;

  return imageUV;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
0, 8, 2, 10,
12, 4, 14, 6,
3, 11, 1, 9,
15, 7, 13, 5
);

const int bayer8x8[64] = int[64](
0, 32, 8, 40, 2, 34, 10, 42,
48, 16, 56, 24, 50, 18, 58, 26,
12, 44, 4, 36, 14, 46, 6, 38,
60, 28, 52, 20, 62, 30, 54, 22,
3, 35, 11, 43, 1, 33, 9, 41,
51, 19, 59, 27, 49, 17, 57, 25,
15, 47, 7, 39, 13, 45, 5, 37,
63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(fract(uv / float(size)) * float(size));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}


void main() {

  float pxSize = u_pxSize * u_pixelRatio;
  vec2 pxSizeUV = gl_FragCoord.xy - .5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + .5) * pxSize;
  vec2 normalizedUV = canvasPixelizedUV / u_resolution;

  vec2 imageUV = getImageUV(normalizedUV);
  vec2 ditheringNoiseUV = canvasPixelizedUV;
  vec4 image = texture(u_image, imageUV);
  float frame = getUvFrame(imageUV, pxSize / u_resolution);

  int type = int(floor(u_type));
  float dithering = 0.0;

  float lum = dot(vec3(.2126, .7152, .0722), image.rgb);
  lum = u_inverted ? (1. - lum) : lum;

  switch (type) {
    case 1: {
      dithering = step(hash21(ditheringNoiseUV), lum);
    } break;
    case 2:
    dithering = getBayerValue(pxSizeUV, 2);
    break;
    case 3:
    dithering = getBayerValue(pxSizeUV, 4);
    break;
    default :
    dithering = getBayerValue(pxSizeUV, 8);
    break;
  }

  float colorSteps = max(floor(u_colorSteps), 1.);
  vec3 color = vec3(0.0);
  float opacity = 1.;

  dithering -= .5;
  float brightness = clamp(lum + dithering / colorSteps, 0.0, 1.0);
  brightness = mix(0.0, brightness, frame);
  brightness = mix(0.0, brightness, image.a);
  float quantLum = floor(brightness * colorSteps + 0.5) / colorSteps;
  quantLum = mix(0.0, quantLum, frame);

  if (u_originalColors == true) {
    vec3 normColor = image.rgb / max(lum, 0.001);
    color = normColor * quantLum;

    float quantAlpha = floor(image.a * colorSteps + 0.5) / colorSteps;
    opacity = mix(quantLum, 1., quantAlpha);
  } else {
    vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
    float fgOpacity = u_colorFront.a;
    vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
    float bgOpacity = u_colorBack.a;
    vec3 hlColor = u_colorHighlight.rgb * u_colorHighlight.a;
    float hlOpacity = u_colorHighlight.a;

    fgColor = mix(fgColor, hlColor, step(1.02 - .02 * u_colorSteps, brightness));
    fgOpacity = mix(fgOpacity, hlOpacity, step(1.02 - .02 * u_colorSteps, brightness));

    color = fgColor * quantLum;
    opacity = fgOpacity * quantLum;
    color += bgColor * (1.0 - opacity);
    opacity += bgOpacity * (1.0 - opacity);
  }

  fragColor = vec4(color, opacity);
}
`,e_={name:"Default",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,colorFront:"#94ffaf",colorBack:"#000c38",colorHighlight:"#eaff94",type:"8x8",size:2,colorSteps:2,originalColors:!1,inverted:!1}},ex={name:"Retro",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,colorFront:"#eeeeee",colorBack:"#5452ff",colorHighlight:"#eeeeee",type:"2x2",size:3,colorSteps:1,originalColors:!0,inverted:!1}},ey=[e_,{name:"Noise",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,colorFront:"#a2997c",colorBack:"#000000",colorHighlight:"#ededed",type:"random",size:1,colorSteps:1,originalColors:!1,inverted:!1}},ex,{name:"Natural",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,colorFront:"#ffffff",colorBack:"#000000",colorHighlight:"#ffffff",type:"8x8",size:2,colorSteps:5,originalColors:!0,inverted:!1}}],eb=(0,t.memo)(function({speed:o=e_.params.speed,frame:a=e_.params.frame,colorFront:t=e_.params.colorFront,colorBack:r=e_.params.colorBack,colorHighlight:l=e_.params.colorHighlight,image:n="",type:f=e_.params.type,colorSteps:c=e_.params.colorSteps,originalColors:m=e_.params.originalColors,inverted:p=e_.params.inverted,pxSize:d,size:g=void 0===d?e_.params.size:d,fit:v=e_.params.fit,scale:h=e_.params.scale,rotation:_=e_.params.rotation,originX:x=e_.params.originX,originY:y=e_.params.originY,offsetX:b=e_.params.offsetX,offsetY:S=e_.params.offsetY,worldWidth:C=e_.params.worldWidth,worldHeight:w=e_.params.worldHeight,...k}){let z={u_image:n,u_colorFront:(0,s.getShaderColorFromString)(t),u_colorBack:(0,s.getShaderColorFromString)(r),u_colorHighlight:(0,s.getShaderColorFromString)(l),u_type:ok[f],u_pxSize:g,u_colorSteps:c,u_originalColors:m,u_inverted:p,u_fit:i.ShaderFitOptions[v],u_rotation:_,u_scale:h,u_offsetX:b,u_offsetY:S,u_originX:x,u_originY:y,u_worldWidth:C,u_worldHeight:w};return(0,u.jsx)(e.ShaderMount,{...k,speed:o,frame:a,fragmentShader:eh,uniforms:z})},r.colorPropsAreEqual),eS={maxColorCount:10},eC=`#version 300 es
precision highp float;

in mediump vec2 v_imageUV;
in mediump vec2 v_objectUV;
out vec4 fragColor;

uniform sampler2D u_image;
uniform float u_time;
uniform mediump float u_imageAspectRatio;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${eS.maxColorCount}];
uniform float u_colorsCount;

uniform float u_angle;
uniform float u_noise;
uniform float u_innerGlow;
uniform float u_outerGlow;
uniform float u_contour;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

float getImgFrame(vec2 uv, float th) {
  float frame = 1.;
  frame *= smoothstep(0., th, uv.y);
  frame *= 1. - smoothstep(1. - th, 1., uv.y);
  frame *= smoothstep(0., th, uv.x);
  frame *= 1. - smoothstep(1. - th, 1., uv.x);
  return frame;
}

float circle(vec2 uv, vec2 c, vec2 r) {
  return 1. - smoothstep(r[0], r[1], length(uv - c));
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

float sst(float edge0, float edge1, float x) {
  return smoothstep(edge0, edge1, x);
}

float shadowShape(vec2 uv, float t, float contour) {
  vec2 scaledUV = uv;

  // base shape tranjectory
  float posY = mix(-1., 2., t);

  // scaleX when it's moving down
  scaledUV.y -= .5;
  float mainCircleScale = sst(0., .8, posY) * lst(1.4, .9, posY);
  scaledUV *= vec2(1., 1. + 1.5 * mainCircleScale);
  scaledUV.y += .5;

  // base shape
  float innerR = .4;
  float outerR = 1. - .3 * (sst(.1, .2, t) * (1. - sst(.2, .5, t)));
  float s = circle(scaledUV, vec2(.5, posY - .2), vec2(innerR, outerR));
  float shapeSizing = sst(.2, .3, t) * sst(.6, .3, t);
  s = pow(s, 1.4);
  s *= 1.2;

  // flat gradient to take over the shadow shape
  float topFlattener = 0.;
  {
    float pos = posY - uv.y;
    float edge = 1.2;
    topFlattener = lst(-.4, 0., pos) * (1. - sst(.0, edge, pos));
    topFlattener = pow(topFlattener, 3.);
    float topFlattenerMixer = (1. - sst(.0, .3, pos));
    s = mix(topFlattener, s, topFlattenerMixer);
  }

  // apple right circle
  {
    float visibility = sst(.6, .7, t) * (1. - sst(.8, .9, t));
    float angle = -2. -t * TWO_PI;
    float rightCircle = circle(uv, vec2(.95 - .2 * cos(angle), .4 - .1 * sin(angle)), vec2(.15, .3));
    rightCircle *= visibility;
    s = mix(s, 0., rightCircle);
  }

  // apple top circle
  {
    float topCircle = circle(uv, vec2(.5, .19), vec2(.05, .25));
    topCircle += 2. * contour * circle(uv, vec2(.5, .19), vec2(.2, .5));
    float visibility = .55 * sst(.2, .3, t) * (1. - sst(.3, .45, t));
    topCircle *= visibility;
    s = mix(s, 0., topCircle);
  }

  float leafMask = circle(uv, vec2(.53, .13), vec2(.08, .19));
  leafMask = mix(leafMask, 0., 1. - sst(.4, .54, uv.x));
  leafMask = mix(0., leafMask, sst(.0, .2, uv.y));
  leafMask *= (sst(.5, 1.1, posY) * sst(1.5, 1.3, posY));
  s += leafMask;

  // apple bottom circle
  {
    float visibility = sst(.0, .4, t) * (1. - sst(.6, .8, t));
    s = mix(s, 0., visibility * circle(uv, vec2(.52, .92), vec2(.09, .25)));
  }

  // random balls that are invisible if apple logo is selected
  {
    float pos = sst(.0, .6, t) * (1. - sst(.6, 1., t));
    s = mix(s, .5, circle(uv, vec2(.0, 1.2 - .5 * pos), vec2(.1, .3)));
    s = mix(s, .0, circle(uv, vec2(1., .5 + .5 * pos), vec2(.1, .3)));

    s = mix(s, 1., circle(uv, vec2(.95, .2 + .2 * sst(.3, .4, t) * sst(.7, .5, t)), vec2(.07, .22)));
    s = mix(s, 1., circle(uv, vec2(.95, .2 + .2 * sst(.3, .4, t) * (1. - sst(.5, .7, t))), vec2(.07, .22)));
    s /= max(1e-4, sst(1., .85, uv.y));
  }

  s = clamp(0., 1., s);
  return s;
}

float blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = radius * texel;

  float w1 = 1.0, w2 = 2.0, w4 = 4.0;
  float norm = 16.0;
  float sum = w4 * centerSample;

  sum += w2 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).g;
  sum += w2 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).g;
  sum += w2 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).g;
  sum += w2 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).g;

  sum += w1 * textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).g;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).g;
  sum += w1 * textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).g;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).g;

  return sum / norm;
}

void main() {
  vec2 uv = v_objectUV + .5;
  uv.y = 1. - uv.y;

  vec2 imgUV = v_imageUV;
  imgUV -= .5;
  imgUV *= 0.5714285714285714;
  imgUV += .5;
  float imgSoftFrame = getImgFrame(imgUV, .03);

  vec4 img = texture(u_image, imgUV);
  vec2 dudx = dFdx(imgUV);
  vec2 dudy = dFdy(imgUV);

  if (img.a == 0.) {
    fragColor = u_colorBack;
    return;
  }

  float t = .1 * u_time;
  t -= .3;

  float tCopy = t + 1. / 3.;
  float tCopy2 = t + 2. / 3.;

  t = mod(t, 1.);
  tCopy = mod(tCopy, 1.);
  tCopy2 = mod(tCopy2, 1.);

  vec2 animationUV = imgUV - vec2(.5);
  float angle = -u_angle * PI / 180.;
  float cosA = cos(angle);
  float sinA = sin(angle);
  animationUV = vec2(
  animationUV.x * cosA - animationUV.y * sinA,
  animationUV.x * sinA + animationUV.y * cosA
  ) + vec2(.5);

  float shape = img[0];

  img[1] = blurEdge3x3(u_image, imgUV, dudx, dudy, 8., img[1]);

  float outerBlur = 1. - mix(1., img[1], shape);
  float innerBlur = mix(img[1], 0., shape);
  float contour = mix(img[2], 0., shape);

  outerBlur *= imgSoftFrame;

  float shadow = shadowShape(animationUV, t, innerBlur);
  float shadowCopy = shadowShape(animationUV, tCopy, innerBlur);
  float shadowCopy2 = shadowShape(animationUV, tCopy2, innerBlur);

  float inner = .8 + .8 * innerBlur;
  inner = mix(inner, 0., shadow);
  inner = mix(inner, 0., shadowCopy);
  inner = mix(inner, 0., shadowCopy2);

  inner *= mix(0., 2., u_innerGlow);

  inner += (u_contour * 2.) * contour;
  inner = min(1., inner);
  inner *= (1. - shape);

  float outer = 0.;
  {
    t *= 3.;
    t = mod(t - .1, 1.);

    outer = .9 * pow(outerBlur, .8);
    float y = mod(animationUV.y - t, 1.);
    float animatedMask = sst(.3, .65, y) * (1. - sst(.65, 1., y));
    animatedMask = .5 + animatedMask;
    outer *= animatedMask;
    outer *= mix(0., 5., pow(u_outerGlow, 2.));
    outer *= imgSoftFrame;
  }

  inner = pow(inner, 1.2);
  float heat = clamp(inner + outer, 0., 1.);

  heat += (.005 + .35 * u_noise) * (fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453123) - .5);

  float mixer = heat * u_colorsCount;
  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;
  float outerShape = 0.;
  for (int i = 1; i < ${eS.maxColorCount+1}; i++) {
    if (i > int(u_colorsCount)) break;
    float m = clamp(mixer - float(i - 1), 0., 1.);
    if (i == 1) {
      outerShape = m;
    }
    vec4 c = u_colors[i - 1];
    c.rgb *= c.a;
    gradient = mix(gradient, c, m);
  }

  vec3 color = gradient.rgb * outerShape;
  float opacity = gradient.a * outerShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1.0 - opacity);
  opacity = opacity + u_colorBack.a * (1.0 - opacity);

  color += .02 * (fract(sin(dot(uv + 1., vec2(12.9898, 78.233))) * 43758.5453123) - .5);

  fragColor = vec4(color, opacity);
}
`;function ew(o){let e=document.createElement("canvas");return new Promise((a,t)=>{let r=new Image;r.crossOrigin="anonymous",r.addEventListener("load",()=>{("string"==typeof o?o.endsWith(".svg"):"image/svg+xml"===o.type)&&(r.width=1e3,r.height=1e3);let i=r.naturalWidth/r.naturalHeight,s=Math.floor(150),l=Math.ceil(2.5*s),n=1e3,f=1e3;i>1?f=Math.floor(1e3/i):n=Math.floor(1e3*i),e.width=n+2*l,e.height=f+2*l;let c=e.getContext("2d",{willReadFrequently:!0});if(!c)throw Error("Failed to get canvas 2d context");c.fillStyle="white",c.fillRect(0,0,e.width,e.height),c.drawImage(r,l,l,n,f);let{width:u,height:m}=e,p=c.getImageData(0,0,u,m).data,d=u*m,g=new Uint8ClampedArray(d);for(let o=0;o<d;o++){let e=4*o,a=p[e]??0,t=p[e+1]??0,r=p[e+2]??0;g[o]=.299*a+.587*t+.114*r|0}let v=Math.max(1,Math.round(.12*s)),h=ez(g,u,m,s,3),_=ez(g,u,m,v,3),x=ez(g,u,m,5,1),y=c.createImageData(u,m),b=y.data;for(let o=0;o<d;o++){let e=4*o;b[e]=x[o]??0,b[e+1]=h[o]??0,b[e+2]=_[o]??0,b[e+3]=255}c.putImageData(y,0,0),e.toBlob(o=>{o?a({blob:o}):t(Error("Failed to create PNG blob"))},"image/png")}),r.addEventListener("error",()=>{t(Error("Failed to load image"))}),r.src="string"==typeof o?o:URL.createObjectURL(o)})}function ek(o,e,a,t){if(t<=0)return o.slice();let r=new Uint8ClampedArray(e*a),i=new Uint32Array(e*a);for(let t=0;t<a;t++){let a=0;for(let r=0;r<e;r++){let s=t*e+r;a+=o[s]??0,i[s]=a+(t>0?i[s-e]??0:0)}}for(let o=0;o<a;o++){let s=Math.max(0,o-t),l=Math.min(a-1,o+t);for(let a=0;a<e;a++){let n=Math.max(0,a-t),f=Math.min(e-1,a+t),c=l*e+f,u=l*e+(n-1),m=(s-1)*e+f,p=(s-1)*e+(n-1),d=(i[c]??0)-(n>0?i[u]??0:0)-(s>0?i[m]??0:0)+(n>0&&s>0?i[p]??0:0),g=(f-n+1)*(l-s+1);r[o*e+a]=Math.round(d/g)}}return r}function ez(o,e,a,t,r){if(t<=0||r<=1)return ek(o,e,a,t);let i=o,s=o;for(let o=0;o<r;o++)i=s=ek(i,e,a,t);return s}let eB="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",eO=[],eF=(o,e)=>(function(o,e=null){for(let a of(null===e&&(e=[o]),eO))if(function(o,e){if(o===e)return!0;if(!o||!e)return!1;let a=o.length;if(e.length!==a)return!1;for(let t=0;t<a;t++)if(o[t]!==e[t])return!1;return!0}(e,a.keys)){if(Object.prototype.hasOwnProperty.call(a,"error"))throw a.error;if(Object.prototype.hasOwnProperty.call(a,"response"))return a.response;throw a.promise}let a={keys:e,promise:("object"==typeof o&&"function"==typeof o.then?o:o(...e)).then(o=>{a.response=o}).catch(o=>a.error=o)};throw eO.push(a),a.promise})(o,e),eU={name:"Default",params:{...i.defaultObjectSizing,scale:.75,speed:1,frame:0,contour:.5,angle:0,noise:0,innerGlow:.5,outerGlow:.5,colorBack:"#000000",colors:["#11206a","#1f3ba2","#2f63e7","#6bd7ff","#ffe679","#ff991e","#ff4c00"]}},eV=[eU,{name:"Sepia",params:{...i.defaultObjectSizing,scale:.75,speed:.5,frame:0,contour:.5,angle:0,noise:.75,innerGlow:.5,outerGlow:.5,colorBack:"#000000",colors:["#997F45","#ffffff"]}}],eR=(0,t.memo)(function({speed:o=eU.params.speed,frame:a=eU.params.frame,image:r="",contour:l=eU.params.contour,angle:n=eU.params.angle,noise:f=eU.params.noise,innerGlow:c=eU.params.innerGlow,outerGlow:m=eU.params.outerGlow,colorBack:p=eU.params.colorBack,colors:d=eU.params.colors,suspendWhenProcessingImage:g=!1,fit:v=eU.params.fit,offsetX:h=eU.params.offsetX,offsetY:_=eU.params.offsetY,originX:x=eU.params.originX,originY:y=eU.params.originY,rotation:b=eU.params.rotation,scale:S=eU.params.scale,worldHeight:C=eU.params.worldHeight,worldWidth:w=eU.params.worldWidth,...k}){let z,B="string"==typeof r?r:r.src,[O,F]=(0,t.useState)(eB);z=g&&"u">typeof window?eF(()=>ew(B).then(o=>URL.createObjectURL(o.blob)),[B,"heatmap"]):O,(0,t.useLayoutEffect)(()=>{if(g)return;if(!B)return void F(eB);let o=!0;return ew(B).then(e=>{o&&F(URL.createObjectURL(e.blob))}),()=>{o=!1}},[B,g]);let U=(0,t.useMemo)(()=>({u_image:z,u_contour:l,u_angle:n,u_noise:f,u_innerGlow:c,u_outerGlow:m,u_colorBack:(0,s.getShaderColorFromString)(p),u_colors:d.map(s.getShaderColorFromString),u_colorsCount:d.length,u_fit:i.ShaderFitOptions[v],u_offsetX:h,u_offsetY:_,u_originX:x,u_originY:y,u_rotation:b,u_scale:S,u_worldHeight:C,u_worldWidth:w}),[o,a,l,n,f,c,m,d,p,z,v,h,_,x,y,b,S,C,w]);return(0,u.jsx)(e.ShaderMount,{...k,speed:o,frame:a,fragmentShader:eC,mipmaps:["u_image"],uniforms:U})},r.colorPropsAreEqual),eM=`#version 300 es
precision mediump float;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform vec2 u_resolution;
uniform float u_time;

uniform vec4 u_colorBack;
uniform vec4 u_colorTint;

uniform float u_softness;
uniform float u_repetition;
uniform float u_shiftRed;
uniform float u_shiftBlue;
uniform float u_distortion;
uniform float u_contour;
uniform float u_angle;

uniform float u_shape;
uniform bool u_isImage;

in vec2 v_objectUV;
in vec2 v_responsiveUV;
in vec2 v_responsiveBoxGivenSize;
in vec2 v_imageUV;

out vec4 fragColor;

${n.declarePI}
${n.rotation2}
${n.simplexNoise}

float getColorChanges(float c1, float c2, float stripe_p, vec3 w, float blur, float bump, float tint) {

  float ch = mix(c2, c1, smoothstep(.0, 2. * blur, stripe_p));

  float border = w[0];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  if (u_isImage == true) {
    bump = smoothstep(.2, .8, bump);
  }
  border = w[0] + .4 * (1. - bump) * w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + .5 * (1. - bump) * w[1];
  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));

  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));

  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
  ch = mix(ch, gradient, smoothstep(border, border + .5 * blur, stripe_p));

  // Tint color is applied with color burn blending
  ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, 0.0001)), u_colorTint.a);
  return ch;
}

float getImgFrame(vec2 uv, float th) {
  float frame = 1.;
  frame *= smoothstep(0., th, uv.y);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.y);
  frame *= smoothstep(0., th, uv.x);
  frame *= 1.0 - smoothstep(1. - th, 1., uv.x);
  return frame;
}

float blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = radius * texel;

  float w1 = 1.0, w2 = 2.0, w4 = 4.0;
  float norm = 16.0;
  float sum = w4 * centerSample;

  sum += w2 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).r;
  sum += w2 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).r;

  sum += w1 * textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).r;
  sum += w1 * textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).r;

  return sum / norm;
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

void main() {

  const float firstFrameOffset = 2.8;
  float t = .3 * (u_time + firstFrameOffset);

  vec2 uv = v_imageUV;
  vec2 dudx = dFdx(v_imageUV);
  vec2 dudy = dFdy(v_imageUV);
  vec4 img = textureGrad(u_image, uv, dudx, dudy);

  if (u_isImage == false) {
    uv = v_objectUV + .5;
    uv.y = 1. - uv.y;
  }

  float cycleWidth = u_repetition;
  float edge = 0.;
  float contOffset = 1.;

  vec2 rotatedUV = uv - vec2(.5);
  float angle = (-u_angle + 70.) * PI / 180.;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rotatedUV = vec2(
  rotatedUV.x * cosA - rotatedUV.y * sinA,
  rotatedUV.x * sinA + rotatedUV.y * cosA
  ) + vec2(.5);

  if (u_isImage == true) {
    float edgeRaw = img.r;
    edge = blurEdge3x3(u_image, uv, dudx, dudy, 6., edgeRaw);
    edge = pow(edge, 1.6);
    edge *= mix(0.0, 1.0, smoothstep(0.0, 0.4, u_contour));
  } else {
    if (u_shape < 1.) {
      // full-fill on canvas
      vec2 borderUV = v_responsiveUV + .5;
      float ratio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
      vec2 mask = min(borderUV, 1. - borderUV);
      vec2 pixel_thickness = 250. / v_responsiveBoxGivenSize;
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);

      uv = v_responsiveUV;
      if (ratio > 1.) {
        uv.y /= ratio;
      } else {
        uv.x *= ratio;
      }
      uv += .5;
      uv.y = 1. - uv.y;

      cycleWidth *= 2.;
      contOffset = 1.5;

    } else if (u_shape < 2.) {
      // circle
      vec2 shapeUV = uv - .5;
      shapeUV *= .67;
      edge = pow(clamp(3. * length(shapeUV), 0., 1.), 18.);
    } else if (u_shape < 3.) {
      // daisy
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.68;

      float r = length(shapeUV) * 2.;
      float a = atan(shapeUV.y, shapeUV.x) + .2;
      r *= (1. + .05 * sin(3. * a + 2. * t));
      float f = abs(cos(a * 3.));
      edge = smoothstep(f, f + .7, r);
      edge *= edge;

      uv *= .8;
      cycleWidth *= 1.6;

    } else if (u_shape < 4.) {
      // diamond
      vec2 shapeUV = uv - .5;
      shapeUV = rotate(shapeUV, .25 * PI);
      shapeUV *= 1.42;
      shapeUV += .5;
      vec2 mask = min(shapeUV, 1. - shapeUV);
      vec2 pixel_thickness = vec2(.15);
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);
    } else if (u_shape < 5.) {
      // metaballs
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.3;
      edge = 0.;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float speed = 1.5 + 2./3. * sin(fi * 12.345);
        float angle = -fi * 1.5;
        vec2 dir1 = vec2(cos(angle), sin(angle));
        vec2 dir2 = vec2(cos(angle + 1.57), sin(angle + 1.));
        vec2 traj = .4 * (dir1 * sin(t * speed + fi * 1.23) + dir2 * cos(t * (speed * 0.7) + fi * 2.17));
        float d = length(shapeUV + traj);
        edge += pow(1.0 - clamp(d, 0.0, 1.0), 4.0);
      }
      edge = 1. - smoothstep(.65, .9, edge);
      edge = pow(edge, 4.);
    }

    edge = mix(smoothstep(.9 - 2. * fwidth(edge), .9, edge), edge, smoothstep(0.0, 0.4, u_contour));

  }

  float opacity = 0.;
  if (u_isImage == true) {
    opacity = img.g;
    float frame = getImgFrame(v_imageUV, 0.);
    opacity *= frame;
  } else {
    opacity = 1. - smoothstep(.9 - 2. * fwidth(edge), .9, edge);
    if (u_shape < 2.) {
      edge = 1.2 * edge;
    } else if (u_shape < 5.) {
      edge = 1.8 * pow(edge, 1.5);
    }
  }

  float diagBLtoTR = rotatedUV.x - rotatedUV.y;
  float diagTLtoBR = rotatedUV.x + rotatedUV.y;

  vec3 color = vec3(0.);
  vec3 color1 = vec3(.98, 0.98, 1.);
  vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, diagTLtoBR));

  vec2 grad_uv = uv - .5;

  float dist = length(grad_uv + vec2(0., .2 * diagBLtoTR));
  grad_uv = rotate(grad_uv, (.25 - .2 * diagBLtoTR) * PI);
  float direction = grad_uv.x;

  float bump = pow(1.8 * dist, 1.2);
  bump = 1. - bump;
  bump *= pow(uv.y, .3);


  float thin_strip_1_ratio = .12 / cycleWidth * (1. - .4 * bump);
  float thin_strip_2_ratio = .07 / cycleWidth * (1. + .4 * bump);
  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);

  float thin_strip_1_width = cycleWidth * thin_strip_1_ratio;
  float thin_strip_2_width = cycleWidth * thin_strip_2_ratio;

  float noise = snoise(uv - t);

  edge += (1. - edge) * u_distortion * noise;

  direction += diagBLtoTR;
  float contour = 0.;
  direction -= 2. * noise * diagBLtoTR * (smoothstep(0., 1., edge) * (1.0 - smoothstep(0., 1., edge)));
  direction *= mix(1., 1. - edge, smoothstep(.5, 1., u_contour));
  direction -= 1.7 * edge * smoothstep(.5, 1., u_contour);
  direction += .2 * pow(u_contour, 4.) * (1.0 - smoothstep(0., 1., edge));

  bump *= clamp(pow(uv.y, .1), .3, 1.);
  direction *= (.1 + (1.1 - edge) * bump);

  direction *= (.4 + .6 * (1.0 - smoothstep(.5, 1., edge)));
  direction += .18 * (smoothstep(.1, .2, uv.y) * (1.0 - smoothstep(.2, .4, uv.y)));
  direction += .03 * (smoothstep(.1, .2, 1. - uv.y) * (1.0 - smoothstep(.2, .4, 1. - uv.y)));

  direction *= (.5 + .5 * pow(uv.y, 2.));
  direction *= cycleWidth;
  direction -= t;


  float colorDispersion = (1. - bump);
  colorDispersion = clamp(colorDispersion, 0., 1.);
  float dispersionRed = colorDispersion;
  dispersionRed += .03 * bump * noise;
  dispersionRed += 5. * (smoothstep(-.1, .2, uv.y) * (1.0 - smoothstep(.1, .5, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, 1., bump)));
  dispersionRed -= diagBLtoTR;

  float dispersionBlue = colorDispersion;
  dispersionBlue *= 1.3;
  dispersionBlue += (smoothstep(0., .4, uv.y) * (1.0 - smoothstep(.1, .8, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, .8, bump)));
  dispersionBlue -= .2 * edge;

  dispersionRed *= (u_shiftRed / 20.);
  dispersionBlue *= (u_shiftBlue / 20.);

  float blur = 0.;
  float rExtraBlur = 0.;
  float gExtraBlur = 0.;
  if (u_isImage == true) {
    float softness = 0.05 * u_softness;
    blur = softness + .5 * smoothstep(1., 10., u_repetition) * smoothstep(.0, 1., edge);
    float smallCanvasT = 1.0 - smoothstep(100., 500., min(u_resolution.x, u_resolution.y));
    blur += smallCanvasT * smoothstep(.0, 1., edge);
    rExtraBlur = softness * (0.05 + .1 * (u_shiftRed / 20.) * bump);
    gExtraBlur = softness * 0.05 / max(0.001, abs(1. - diagBLtoTR));
  } else {
    blur = u_softness / 15. + .3 * contour;
  }

  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
  w[1] -= .02 * smoothstep(.0, 1., edge + bump);
  float stripe_r = fract(direction + dispersionRed);
  float r = getColorChanges(color1.r, color2.r, stripe_r, w, blur + fwidth(stripe_r) + rExtraBlur, bump, u_colorTint.r);
  float stripe_g = fract(direction);
  float g = getColorChanges(color1.g, color2.g, stripe_g, w, blur + fwidth(stripe_g) + gExtraBlur, bump, u_colorTint.g);
  float stripe_b = fract(direction - dispersionBlue);
  float b = getColorChanges(color1.b, color2.b, stripe_b, w, blur + fwidth(stripe_b), bump, u_colorTint.b);

  color = vec3(r, g, b);
  color *= opacity;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  ${n.colorBandingFix}

  fragColor = vec4(color, opacity);
}
`;function eP(o){let e=document.createElement("canvas"),a=e.getContext("2d"),t="string"==typeof o&&o.startsWith("blob:");return new Promise((r,i)=>{if(!o||!a)return void i(Error("Invalid file or canvas context"));let s=t&&fetch(o).then(o=>o.headers.get("Content-Type")),l=new Image;l.crossOrigin="anonymous";let n=performance.now();l.onload=async()=>{let t,n=await s;t=n?"image/svg+xml"===n:"string"==typeof o?o.endsWith(".svg")||o.startsWith("data:image/svg+xml"):"image/svg+xml"===o.type;let f=l.width||l.naturalWidth,c=l.height||l.naturalHeight;if(t){let o=f/c;f>c?(f=4096,c=4096/o):(c=4096,f=4096*o),l.width=f,l.height=c}let u=512/Math.min(f,c),m=Math.round(f*u),p=Math.round(c*u);e.width=f,e.height=c;let d=document.createElement("canvas");d.width=m,d.height=p;let g=d.getContext("2d");g.drawImage(l,0,0,m,p);let v=performance.now(),h=g.getImageData(0,0,m,p).data,_=new Uint8Array(m*p),x=new Uint8Array(m*p),y=0;for(let o=0,e=0;o<h.length;o+=4,e++){let a=+(0!==h[o+3]);_[e]=a,y+=a}let b=[],S=[];for(let o=0;o<p;o++)for(let e=0;e<m;e++){let a=o*m+e;if(_[a])0!==e&&e!==m-1&&0!==o&&o!==p-1&&_[a-1]&&_[a+1]&&_[a-m]&&_[a+m]&&_[a-m-1]&&_[a-m+1]&&_[a+m-1]&&_[a+m+1]?S.push(a):(x[a]=1,b.push(a))}let C=function(o,e,a,t,r,i){let s=a.length,l=new Int32Array(4*s);for(let e=0;e<s;e++){let t=a[e],s=t%r,n=Math.floor(t/r);l[4*e+0]=s<r-1&&o[t+1]?t+1:-1,l[4*e+1]=s>0&&o[t-1]?t-1:-1,l[4*e+2]=n>0&&o[t-r]?t-r:-1,l[4*e+3]=n<i-1&&o[t+r]?t+r:-1}return{interiorPixels:a,boundaryPixels:t,pixelCount:s,neighborIndices:l}}(_,0,new Uint32Array(S),new Uint32Array(b),m,p),w=performance.now(),k=function(o,e,a,t,r){let i=new Float32Array(t*r),{interiorPixels:s,neighborIndices:l,pixelCount:n}=o,f=performance.now(),c=[],u=[];for(let o=0;o<n;o++){let e=s[o];(e%t+Math.floor(e/t))%2==0?c.push(o):u.push(o)}for(let o=0;o<40;o++){for(let o of c){let e=s[o],a=l[4*o+0],t=l[4*o+1],r=l[4*o+2],n=l[4*o+3],f=0;a>=0&&(f+=i[a]),t>=0&&(f+=i[t]),r>=0&&(f+=i[r]),n>=0&&(f+=i[n]);let c=(.01+f)/4;i[e]=1.9*c+-.8999999999999999*i[e]}for(let o of u){let e=s[o],a=l[4*o+0],t=l[4*o+1],r=l[4*o+2],n=l[4*o+3],f=0;a>=0&&(f+=i[a]),t>=0&&(f+=i[t]),r>=0&&(f+=i[r]),n>=0&&(f+=i[n]);let c=(.01+f)/4;i[e]=1.9*c+-.8999999999999999*i[e]}}0;return i}(C,0,0,m,p);let z=0;for(let o=0;o<S.length;o++){let e=S[o];k[e]>z&&(z=k[e])}let B=document.createElement("canvas");B.width=m,B.height=p;let O=B.getContext("2d"),F=O.createImageData(m,p);for(let o=0;o<p;o++)for(let e=0;e<m;e++){let a=o*m+e,t=4*a;if(_[a]){let o=255*(1-k[a]/z);F.data[t]=o,F.data[t+1]=o,F.data[t+2]=o,F.data[t+3]=255}else F.data[t]=255,F.data[t+1]=255,F.data[t+2]=255,F.data[t+3]=0}O.putImageData(F,0,0),a.imageSmoothingEnabled=!0,a.imageSmoothingQuality="high",a.drawImage(B,0,0,m,p,0,0,f,c);let U=a.getImageData(0,0,f,c),V=document.createElement("canvas");V.width=f,V.height=c;let R=V.getContext("2d");R.drawImage(l,0,0,f,c);let M=R.getImageData(0,0,f,c);for(let o=0;o<U.data.length;o+=4){let e=M.data[o+3],a=U.data[o+3];0===e?(U.data[o]=255,U.data[o+1]=0):(U.data[o]=0===a?0:U.data[o],U.data[o+1]=e),U.data[o+2]=255,U.data[o+3]=255}a.putImageData(U,0,0),e.toBlob(o=>{if(!o)return void i(Error("Failed to create PNG blob"));0;r({imageData:U,pngBlob:o})},"image/png")},l.onerror=()=>i(Error("Failed to load image")),l.src="string"==typeof o?o:URL.createObjectURL(o)})}let eY={none:0,circle:1,daisy:2,diamond:3,metaballs:4},eI={name:"Default",params:{...i.defaultObjectSizing,scale:.6,speed:1,frame:0,colorBack:"#AAAAAC",colorTint:"#ffffff",distortion:.07,repetition:2,shiftRed:.3,shiftBlue:.3,contour:.4,softness:.1,angle:70,shape:"diamond"}},eA=[eI,{name:"Noir",params:{...i.defaultObjectSizing,scale:.6,speed:1,frame:0,colorBack:"#000000",colorTint:"#606060",softness:.45,repetition:1.5,shiftRed:0,shiftBlue:0,distortion:0,contour:0,angle:90,shape:"diamond"}},{name:"Backdrop",params:{...i.defaultObjectSizing,speed:1,frame:0,scale:1.5,colorBack:"#AAAAAC",colorTint:"#ffffff",softness:.05,repetition:1.5,shiftRed:.3,shiftBlue:.3,distortion:.1,contour:.4,shape:"none",angle:90,worldWidth:0,worldHeight:0}},{name:"Stripes",params:{...i.defaultObjectSizing,speed:1,frame:0,scale:.6,colorBack:"#000000",colorTint:"#2c5d72",softness:.8,repetition:6,shiftRed:1,shiftBlue:-1,distortion:.4,contour:.4,shape:"circle",angle:0}}],eN=(0,t.memo)(function({colorBack:o=eI.params.colorBack,colorTint:a=eI.params.colorTint,speed:r=eI.params.speed,frame:l=eI.params.frame,image:n="",contour:f=eI.params.contour,distortion:c=eI.params.distortion,softness:m=eI.params.softness,repetition:p=eI.params.repetition,shiftRed:d=eI.params.shiftRed,shiftBlue:g=eI.params.shiftBlue,angle:v=eI.params.angle,shape:h=eI.params.shape,suspendWhenProcessingImage:_=!1,fit:x=eI.params.fit,scale:y=eI.params.scale,rotation:b=eI.params.rotation,originX:S=eI.params.originX,originY:C=eI.params.originY,offsetX:w=eI.params.offsetX,offsetY:k=eI.params.offsetY,worldWidth:z=eI.params.worldWidth,worldHeight:B=eI.params.worldHeight,...O}){let F,U="string"==typeof n?n:n.src,[V,R]=(0,t.useState)(eB);F=_&&"u">typeof window&&U?eF(()=>eP(U).then(o=>URL.createObjectURL(o.pngBlob)),[U,"liquid-metal"]):V,(0,t.useLayoutEffect)(()=>{if(_)return;if(!U)return void R(eB);let o=!0;return eP(U).then(e=>{o&&R(URL.createObjectURL(e.pngBlob))}),()=>{o=!1}},[U,_]);let M={u_colorBack:(0,s.getShaderColorFromString)(o),u_colorTint:(0,s.getShaderColorFromString)(a),u_image:F,u_contour:f,u_distortion:c,u_softness:m,u_repetition:p,u_shiftRed:d,u_shiftBlue:g,u_angle:v,u_isImage:!!n,u_shape:eY[h],u_fit:i.ShaderFitOptions[x],u_scale:y,u_rotation:b,u_offsetX:w,u_offsetY:k,u_originX:S,u_originY:C,u_worldWidth:z,u_worldHeight:B};return(0,u.jsx)(e.ShaderMount,{...O,speed:r,frame:l,fragmentShader:eM,mipmaps:["u_image"],uniforms:M})}),eX=`#version 300 es
precision mediump float;

uniform float u_rotation;

uniform float u_time;

uniform vec4 u_colorFront;
uniform vec4 u_colorBack;
uniform float u_radius;
uniform float u_contrast;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform float u_size;
uniform float u_grainMixer;
uniform float u_grainOverlay;
uniform float u_grainSize;
uniform float u_grid;
uniform bool u_originalColors;
uniform bool u_inverted;
uniform float u_type;

in vec2 v_imageUV;

out vec4 fragColor;

${n.declarePI}
${n.rotation2}
${n.proceduralHash21}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float lst(float edge0, float edge1, float x) {
  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

float sst(float edge0, float edge1, float x) {
  return smoothstep(edge0, edge1, x);
}

float getCircle(vec2 uv, float r, float baseR) {
  r = mix(.25 * baseR, 0., r);
  float d = length(uv - .5);
  float aa = fwidth(d);
  return 1. - smoothstep(r - aa, r + aa, d);
}

float getCell(vec2 uv) {
  float insideX = step(0.0, uv.x) * (1.0 - step(1.0, uv.x));
  float insideY = step(0.0, uv.y) * (1.0 - step(1.0, uv.y));
  return insideX * insideY;
}

float getCircleWithHole(vec2 uv, float r, float baseR) {
  float cell = getCell(uv);

  r = mix(.75 * baseR, 0., r);
  float rMod = mod(r, .5);

  float d = length(uv - .5);
  float aa = fwidth(d);
  float circle = 1. - smoothstep(rMod - aa, rMod + aa, d);
  if (r < .5) {
    return circle;
  } else {
    return cell - circle;
  }
}

float getGooeyBall(vec2 uv, float r, float baseR) {
  float d = length(uv - .5);
  float sizeRadius = .3;
  if (u_grid == 1.) {
    sizeRadius = .42;
  }
  sizeRadius = mix(sizeRadius * baseR, 0., r);
  d = 1. - sst(0., sizeRadius, d);

  d = pow(d, 2. + baseR);
  return d;
}

float getSoftBall(vec2 uv, float r, float baseR) {
  float d = length(uv - .5);
  float sizeRadius = clamp(baseR, 0., 1.);
  sizeRadius = mix(.5 * sizeRadius, 0., r);
  d = 1. - lst(0., sizeRadius, d);
  float powRadius = 1. - lst(0., 2., baseR);
  d = pow(d, 4. + 3. * powRadius);
  return d;
}

float getUvFrame(vec2 uv, vec2 pad) {
  float aa = 0.0001;

  float left   = smoothstep(-pad.x, -pad.x + aa, uv.x);
  float right  = smoothstep(1.0 + pad.x, 1.0 + pad.x - aa, uv.x);
  float bottom = smoothstep(-pad.y, -pad.y + aa, uv.y);
  float top    = smoothstep(1.0 + pad.y, 1.0 + pad.y - aa, uv.y);

  return left * right * bottom * top;
}

float sigmoid(float x, float k) {
  return 1.0 / (1.0 + exp(-k * (x - 0.5)));
}

float getLumAtPx(vec2 uv, float contrast) {
  vec4 tex = texture(u_image, uv);
  vec3 color = vec3(
  sigmoid(tex.r, contrast),
  sigmoid(tex.g, contrast),
  sigmoid(tex.b, contrast)
  );
  float lum = dot(vec3(0.2126, 0.7152, 0.0722), color);
  lum = mix(1., lum, tex.a);
  lum = u_inverted ? (1. - lum) : lum;
  return lum;
}

float getLumBall(vec2 p, vec2 pad, vec2 inCellOffset, float contrast, float baseR, float stepSize, out vec4 ballColor) {
  p += inCellOffset;
  vec2 uv_i = floor(p);
  vec2 uv_f = fract(p);
  vec2 samplingUV = (uv_i + .5 - inCellOffset) * pad + vec2(.5);
  float outOfFrame = getUvFrame(samplingUV, pad * stepSize);

  float lum = getLumAtPx(samplingUV, contrast);
  ballColor = texture(u_image, samplingUV);
  ballColor.rgb *= ballColor.a;
  ballColor *= outOfFrame;

  float ball = 0.;
  if (u_type == 0.) {
    // classic
    ball = getCircle(uv_f, lum, baseR);
  } else if (u_type == 1.) {
    // gooey
    ball = getGooeyBall(uv_f, lum, baseR);
  } else if (u_type == 2.) {
    // holes
    ball = getCircleWithHole(uv_f, lum, baseR);
  } else if (u_type == 3.) {
    // soft
    ball = getSoftBall(uv_f, lum, baseR);
  }

  return ball * outOfFrame;
}


void main() {

  float stepMultiplier = 1.;
  if (u_type == 0.) {
    // classic
    stepMultiplier = 2.;
  } else if (u_type == 1. || u_type == 3.) {
    // gooey & soft
    stepMultiplier = 6.;
  }

  float cellsPerSide = mix(300., 7., pow(u_size, .7));
  cellsPerSide /= stepMultiplier;
  float cellSizeY = 1. / cellsPerSide;
  vec2 pad = cellSizeY * vec2(1. / u_imageAspectRatio, 1.);
  if (u_type == 1. && u_grid == 1.) {
    // gooey diagonal grid works differently
    pad *= .7;
  }

  vec2 uv = v_imageUV;
  uv -= vec2(.5);
  uv /= pad;

  float contrast = mix(0., 15., pow(u_contrast, 1.5));
  float baseRadius = u_radius;
  if (u_originalColors == true) {
    contrast = mix(.1, 4., pow(u_contrast, 2.));
    baseRadius = 2. * pow(.5 * u_radius, .3);
  }

  float totalShape = 0.;
  vec3 totalColor = vec3(0.);
  float totalOpacity = 0.;

  vec4 ballColor;
  float shape;
  float stepSize = 1. / stepMultiplier;
  for (float x = -0.5; x < 0.5; x += stepSize) {
    for (float y = -0.5; y < 0.5; y += stepSize) {
      vec2 offset = vec2(x, y);

      if (u_grid == 1.) {
        float rowIndex = floor((y + .5) / stepSize);
        float colIndex = floor((x + .5) / stepSize);
        if (stepSize == 1.) {
          rowIndex = floor(uv.y + y + 1.);
          if (u_type == 1.) {
            colIndex = floor(uv.x + x + 1.);
          }
        }
        if (u_type == 1.) {
          if (mod(rowIndex + colIndex, 2.) == 1.) {
            continue;
          }
        } else {
          if (mod(rowIndex, 2.) == 1.) {
            offset.x += .5 * stepSize;
          }
        }
      }

      shape = getLumBall(uv, pad, offset, contrast, baseRadius, stepSize, ballColor);
      totalColor   += ballColor.rgb * shape;
      totalShape   += shape;
      totalOpacity += shape;
    }
  }

  const float eps = 1e-4;

  totalColor /= max(totalShape, eps);
  totalOpacity /= max(totalShape, eps);

  float finalShape = 0.;
  if (u_type == 0.) {
    finalShape = min(1., totalShape);
  } else if (u_type == 1.) {
    float aa = fwidth(totalShape);
    float th = .5;
    finalShape = smoothstep(th - aa, th + aa, totalShape);
  } else if (u_type == 2.) {
    finalShape = min(1., totalShape);
  } else if (u_type == 3.) {
    finalShape = totalShape;
  }

  vec2 grainSize = mix(2000., 200., u_grainSize) * vec2(1., 1. / u_imageAspectRatio);
  vec2 grainUV = v_imageUV - .5;
  grainUV *= grainSize;
  grainUV += .5;
  float grain = valueNoise(grainUV);
  grain = smoothstep(.55, .7 + .2 * u_grainMixer, grain);
  grain *= u_grainMixer;
  finalShape = mix(finalShape, 0., grain);

  vec3 color = vec3(0.);
  float opacity = 0.;

  if (u_originalColors == true) {
    color = totalColor * finalShape;
    opacity = totalOpacity * finalShape;

    vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
    color = color + bgColor * (1. - opacity);
    opacity = opacity + u_colorBack.a * (1. - opacity);
  } else {
    vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
    float fgOpacity = u_colorFront.a;
    vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
    float bgOpacity = u_colorBack.a;

    color = fgColor * finalShape;
    opacity = fgOpacity * finalShape;
    color += bgColor * (1. - opacity);
    opacity += bgOpacity * (1. - opacity);
  }

  float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
  grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
  grainOverlay = pow(grainOverlay, 1.3);

  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  color = mix(color, grainOverlayColor, .5 * grainOverlayStrength);

  opacity += .5 * grainOverlayStrength;
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`,eT={classic:0,gooey:1,holes:2,soft:3},eW={square:0,hex:1},ej={name:"Default",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,colorBack:"#f2f1e8",colorFront:"#2b2b2b",size:.5,radius:1.25,contrast:.4,originalColors:!1,inverted:!1,grainMixer:.2,grainOverlay:.2,grainSize:.5,grid:"hex",type:"gooey"}},eD=[ej,{name:"LED screen",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,colorBack:"#000000",colorFront:"#29ff7b",size:.5,radius:1.5,contrast:.3,originalColors:!1,inverted:!1,grainMixer:0,grainOverlay:0,grainSize:.5,grid:"square",type:"soft"}},{name:"Mosaic",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,colorBack:"#000000",colorFront:"#b2aeae",size:.6,radius:2,contrast:.01,originalColors:!0,inverted:!1,grainMixer:0,grainOverlay:0,grainSize:.5,grid:"hex",type:"classic"}},{name:"Round and square",params:{...i.defaultObjectSizing,fit:"cover",speed:0,frame:0,colorBack:"#141414",colorFront:"#ff8000",size:.8,radius:1,contrast:1,originalColors:!1,inverted:!0,grainMixer:.05,grainOverlay:.3,grainSize:.5,grid:"square",type:"holes"}}],eG=(0,t.memo)(function({speed:o=ej.params.speed,frame:a=ej.params.frame,colorFront:t=ej.params.colorFront,colorBack:r=ej.params.colorBack,image:l="",size:n=ej.params.size,radius:f=ej.params.radius,contrast:c=ej.params.contrast,originalColors:m=ej.params.originalColors,inverted:p=ej.params.inverted,grainMixer:d=ej.params.grainMixer,grainOverlay:g=ej.params.grainOverlay,grainSize:v=ej.params.grainSize,grid:h=ej.params.grid,type:_=ej.params.type,fit:x=ej.params.fit,scale:y=ej.params.scale,rotation:b=ej.params.rotation,originX:S=ej.params.originX,originY:C=ej.params.originY,offsetX:w=ej.params.offsetX,offsetY:k=ej.params.offsetY,worldWidth:z=ej.params.worldWidth,worldHeight:B=ej.params.worldHeight,...O}){let F={u_image:l,u_colorFront:(0,s.getShaderColorFromString)(t),u_colorBack:(0,s.getShaderColorFromString)(r),u_size:n,u_radius:f,u_contrast:c,u_originalColors:m,u_inverted:p,u_grainMixer:d,u_grainOverlay:g,u_grainSize:v,u_grid:eW[h],u_type:eT[_],u_fit:i.ShaderFitOptions[x],u_rotation:b,u_scale:y,u_offsetX:w,u_offsetY:k,u_originX:S,u_originY:C,u_worldWidth:z,u_worldHeight:B};return(0,u.jsx)(e.ShaderMount,{...O,speed:o,frame:a,fragmentShader:eX,uniforms:F})},r.colorPropsAreEqual),eH=`#version 300 es
precision mediump float;

uniform sampler2D u_image;
uniform float u_imageAspectRatio;

uniform vec4 u_colorBack;
uniform vec4 u_colorC;
uniform vec4 u_colorM;
uniform vec4 u_colorY;
uniform vec4 u_colorK;
uniform float u_size;
uniform float u_minDot;
uniform float u_contrast;
uniform float u_grainSize;
uniform float u_grainMixer;
uniform float u_grainOverlay;
uniform float u_gridNoise;
uniform float u_softness;
uniform float u_floodC;
uniform float u_floodM;
uniform float u_floodY;
uniform float u_floodK;
uniform float u_gainC;
uniform float u_gainM;
uniform float u_gainY;
uniform float u_gainK;
uniform float u_type;
uniform sampler2D u_noiseTexture;

in vec2 v_imageUV;
out vec4 fragColor;

const float shiftC = -.5;
const float shiftM = -.25;
const float shiftY = .2;
const float shiftK = 0.;

// Precomputed sin/cos for rotation angles (15\xb0, 75\xb0, 0\xb0, 45\xb0)
const float cosC = 0.9659258;  const float sinC = 0.2588190;   // 15\xb0
const float cosM = 0.2588190;  const float sinM = 0.9659258;   // 75\xb0
const float cosY = 1.0;        const float sinY = 0.0;         // 0\xb0
const float cosK = 0.7071068;  const float sinK = 0.7071068;   // 45\xb0

${n.declarePI}

vec2 randomRG(vec2 p) {
  vec2 uv = floor(p) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).rg;
}
vec3 hash23(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.3183099, 0.3678794, 0.3141592)) + 0.1;
  p3 += dot(p3, p3.yzx + 19.19);
  return fract(vec3(p3.x * p3.y, p3.y * p3.z, p3.z * p3.x));
}

float sst(float edge0, float edge1, float x) {
  return smoothstep(edge0, edge1, x);
}

vec3 valueNoise3(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec3 a = hash23(i);
  vec3 b = hash23(i + vec2(1.0, 0.0));
  vec3 c = hash23(i + vec2(0.0, 1.0));
  vec3 d = hash23(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  vec3 x1 = mix(a, b, u.x);
  vec3 x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float getUvFrame(vec2 uv, vec2 pad) {
  float left   = smoothstep(-pad.x, 0., uv.x);
  float right  = smoothstep(1. + pad.x, 1., uv.x);
  float bottom = smoothstep(-pad.y, 0., uv.y);
  float top    = smoothstep(1. + pad.y, 1., uv.y);

  return left * right * bottom * top;
}

vec4 RGBAtoCMYK(vec4 rgba) {
  float k = 1. - max(max(rgba.r, rgba.g), rgba.b);
  float denom = 1. - k;
  vec3 cmy = vec3(0.);
  if (denom > 1e-5) {
    cmy = (1. - rgba.rgb - vec3(k)) / denom;
  }
  return vec4(cmy, k) * rgba.a;
}

vec3 applyContrast(vec3 rgb) {
  return clamp((rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
}

// Single-component CMYK extractors with contrast built-in, alpha-aware
float getCyan(vec4 rgba) {
  vec3 c = clamp((rgba.rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float maxRGB = max(max(c.r, c.g), c.b);
  return (maxRGB > 1e-5 ? (maxRGB - c.r) / maxRGB : 0.) * rgba.a;
}
float getMagenta(vec4 rgba) {
  vec3 c = clamp((rgba.rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float maxRGB = max(max(c.r, c.g), c.b);
  return (maxRGB > 1e-5 ? (maxRGB - c.g) / maxRGB : 0.) * rgba.a;
}
float getYellow(vec4 rgba) {
  vec3 c = clamp((rgba.rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  float maxRGB = max(max(c.r, c.g), c.b);
  return (maxRGB > 1e-5 ? (maxRGB - c.b) / maxRGB : 0.) * rgba.a;
}
float getBlack(vec4 rgba) {
  vec3 c = clamp((rgba.rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);
  return (1. - max(max(c.r, c.g), c.b)) * rgba.a;
}

vec2 cellCenterPos(vec2 uv, vec2 cellOffset, float channelIdx) {
  vec2 cellCenter = floor(uv) + .5 + cellOffset;
  return cellCenter + (randomRG(cellCenter + channelIdx * 50.) - .5) * u_gridNoise;
}

vec2 gridToImageUV(vec2 cellCenter, float cosA, float sinA, float shift, vec2 pad) {
  vec2 uvGrid = mat2(cosA, -sinA, sinA, cosA) * (cellCenter - shift);
  return uvGrid * pad + 0.5;
}

void colorMask(vec2 pos, vec2 cellCenter, float rad, float transparency, float grain, float channelAddon, float channelgain, float generalComp, bool isJoined, inout float outMask) {
  float dist = length(pos - cellCenter);

  float radius = rad;
  radius *= (1. + generalComp);
  radius += (.15 + channelgain * radius);
  radius = max(0., radius);
  radius = mix(0., radius, transparency);
  radius += channelAddon;
  radius *= (1. - grain);

  float mask = 1. - sst(0., radius, dist);
  if (isJoined) {
    // ink or sharp (joined)
    mask = pow(mask, 1.2);
  } else {
    // dots (separate)
    mask = sst(.5 - .5 * u_softness, .51 + .49 * u_softness, mask);
  }

  mask *= mix(1., mix(.5, 1., 1.5 * radius), u_softness);
  outMask += mask;
}

vec3 applyInk(vec3 paper, vec3 inkColor, float cov) {
  vec3 inkEffect = mix(vec3(1.0), inkColor, clamp(cov, 0.0, 1.0));
  return paper * inkEffect;
}

void main() {
  vec2 uv = v_imageUV;

  float cellsPerSide = mix(400.0, 7.0, pow(u_size, 0.7));
  float cellSizeY = 1.0 / cellsPerSide;
  vec2 pad = cellSizeY * vec2(1.0 / u_imageAspectRatio, 1.0);
  vec2 uvGrid = (uv - .5) / pad;
  float insideImageBox = getUvFrame(uv, pad);

  float generalComp = .1 * u_softness + .1 * u_gridNoise + .1 * (1. - step(0.5, u_type)) * (1.5 - u_softness);

  vec2 uvC = mat2(cosC, sinC, -sinC, cosC) * uvGrid + shiftC;
  vec2 uvM = mat2(cosM, sinM, -sinM, cosM) * uvGrid + shiftM;
  vec2 uvY = mat2(cosY, sinY, -sinY, cosY) * uvGrid + shiftY;
  vec2 uvK = mat2(cosK, sinK, -sinK, cosK) * uvGrid + shiftK;

  vec2 grainSize = mix(2000., 200., u_grainSize) * vec2(1., 1. / u_imageAspectRatio);
  vec2 grainUV = (v_imageUV - .5) * grainSize + .5;
  vec3 noiseValues = valueNoise3(grainUV);
  float grain = sst(.55, 1., noiseValues.r);
  grain *= u_grainMixer;

  vec4 outMask = vec4(0.);
  bool isJoined = u_type > 0.5;

  if (u_type < 1.5) {
    // dots or ink: per-cell color sampling
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        vec2 cellOffset = vec2(float(dx), float(dy));

        vec2 cellCenterC = cellCenterPos(uvC, cellOffset, 0.);
        vec4 texC = texture(u_image, gridToImageUV(cellCenterC, cosC, sinC, shiftC, pad));
        colorMask(uvC, cellCenterC, getCyan(texC), insideImageBox * texC.a, grain, u_floodC, u_gainC, generalComp, isJoined, outMask[0]);

        vec2 cellCenterM = cellCenterPos(uvM, cellOffset, 1.);
        vec4 texM = texture(u_image, gridToImageUV(cellCenterM, cosM, sinM, shiftM, pad));
        colorMask(uvM, cellCenterM, getMagenta(texM), insideImageBox * texM.a, grain, u_floodM, u_gainM, generalComp, isJoined, outMask[1]);

        vec2 cellCenterY = cellCenterPos(uvY, cellOffset, 2.);
        vec4 texY = texture(u_image, gridToImageUV(cellCenterY, cosY, sinY, shiftY, pad));
        colorMask(uvY, cellCenterY, getYellow(texY), insideImageBox * texY.a, grain, u_floodY, u_gainY, generalComp, isJoined, outMask[2]);

        vec2 cellCenterK = cellCenterPos(uvK, cellOffset, 3.);
        vec4 texK = texture(u_image, gridToImageUV(cellCenterK, cosK, sinK, shiftK, pad));
        colorMask(uvK, cellCenterK, getBlack(texK), insideImageBox * texK.a, grain, u_floodK, u_gainK, generalComp, isJoined, outMask[3]);
      }
    }
  } else {
    // sharp: direct px color sampling
    vec4 tex = texture(u_image, uv);
    tex.rgb = applyContrast(tex.rgb);
    insideImageBox *= tex.a;
    vec4 cmykOriginal = RGBAtoCMYK(tex);
    for (int dy = -1; dy <= 1; dy++) {
      for (int dx = -1; dx <= 1; dx++) {
        vec2 cellOffset = vec2(float(dx), float(dy));

        colorMask(uvC, cellCenterPos(uvC, cellOffset, 0.), cmykOriginal.x, insideImageBox, grain, u_floodC, u_gainC, generalComp, isJoined, outMask[0]);
        colorMask(uvM, cellCenterPos(uvM, cellOffset, 1.), cmykOriginal.y, insideImageBox, grain, u_floodM, u_gainM, generalComp, isJoined, outMask[1]);
        colorMask(uvY, cellCenterPos(uvY, cellOffset, 2.), cmykOriginal.z, insideImageBox, grain, u_floodY, u_gainY, generalComp, isJoined, outMask[2]);
        colorMask(uvK, cellCenterPos(uvK, cellOffset, 3.), cmykOriginal.w, insideImageBox, grain, u_floodK, u_gainK, generalComp, isJoined, outMask[3]);
      }
    }
  }

  float shape;

  float C = outMask[0];
  float M = outMask[1];
  float Y = outMask[2];
  float K = outMask[3];

  if (isJoined) {
    // ink or sharp: apply threshold for joined dots
    float th = .5;
    float sLeft = th * u_softness;
    float sRight = (1. - th) * u_softness + .01;
    C = smoothstep(th - sLeft - fwidth(C), th + sRight, C);
    M = smoothstep(th - sLeft - fwidth(M), th + sRight, M);
    Y = smoothstep(th - sLeft - fwidth(Y), th + sRight, Y);
    K = smoothstep(th - sLeft - fwidth(K), th + sRight, K);
  }

  C *= u_colorC.a;
  M *= u_colorM.a;
  Y *= u_colorY.a;
  K *= u_colorK.a;

  vec3 ink = vec3(1.);
  ink = applyInk(ink, u_colorK.rgb, K);
  ink = applyInk(ink, u_colorC.rgb, C);
  ink = applyInk(ink, u_colorM.rgb, M);
  ink = applyInk(ink, u_colorY.rgb, Y);

  shape = clamp(max(max(C, M), max(Y, K)), 0., 1.);

  vec3 color = u_colorBack.rgb * u_colorBack.a;

  float opacity = u_colorBack.a;
  color = mix(color, ink, shape);
  opacity += shape;
  opacity = clamp(opacity, 0., 1.);

  float grainOverlay = mix(noiseValues.g, noiseValues.b, .5);
  grainOverlay = pow(grainOverlay, 1.3);

  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  color = mix(color, grainOverlayColor, .5 * grainOverlayStrength);

  opacity += .5 * grainOverlayStrength;
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`,eq={dots:0,ink:1,sharp:2},e$={name:"Default",params:{...i.defaultObjectSizing,scale:1,fit:"cover",speed:0,frame:0,colorBack:"#fbfaf5",colorC:"#00b4ff",colorM:"#fc519f",colorY:"#ffd800",colorK:"#231f20",size:.2,contrast:1,softness:1,grainSize:.5,grainMixer:0,grainOverlay:0,gridNoise:.2,floodC:.15,floodM:0,floodY:0,floodK:0,gainC:.3,gainM:0,gainY:.2,gainK:0,type:"ink"}},eL=[e$,{name:"Drops",params:{...i.defaultObjectSizing,scale:1,fit:"cover",speed:0,frame:0,colorBack:"#eeefd7",colorC:"#00b2ff",colorM:"#fc4f4f",colorY:"#ffd900",colorK:"#231f20",size:.88,contrast:1.15,softness:0,grainSize:.01,grainMixer:.05,grainOverlay:.25,gridNoise:.5,floodC:.15,floodM:0,floodY:0,floodK:0,gainC:1,gainM:.44,gainY:-1,gainK:0,type:"ink"}},{name:"Newspaper",params:{...i.defaultObjectSizing,scale:1,fit:"cover",speed:0,frame:0,colorBack:"#f2f1e8",colorC:"#7a7a75",colorM:"#7a7a75",colorY:"#7a7a75",colorK:"#231f20",size:.01,contrast:2,softness:.2,grainSize:0,grainMixer:0,grainOverlay:.2,gridNoise:.6,floodC:0,floodM:0,floodY:0,floodK:.1,gainC:-.17,gainM:-.45,gainY:-.45,gainK:0,type:"dots"}},{name:"Vintage",params:{...i.defaultObjectSizing,scale:1,fit:"cover",speed:0,frame:0,colorBack:"#fffaf0",colorC:"#59afc5",colorM:"#d8697c",colorY:"#fad85c",colorK:"#2d2824",size:.2,contrast:1.25,softness:.4,grainSize:.5,grainMixer:.15,grainOverlay:.1,gridNoise:.45,floodC:.15,floodM:0,floodY:0,floodK:0,gainC:.3,gainM:0,gainY:.2,gainK:0,type:"sharp"}}],eE=(0,t.memo)(function({speed:o=e$.params.speed,frame:a=e$.params.frame,colorBack:t=e$.params.colorBack,colorC:r=e$.params.colorC,colorM:n=e$.params.colorM,colorY:f=e$.params.colorY,colorK:c=e$.params.colorK,image:m="",size:p=e$.params.size,contrast:d=e$.params.contrast,softness:g=e$.params.softness,grainSize:v=e$.params.grainSize,grainMixer:h=e$.params.grainMixer,grainOverlay:_=e$.params.grainOverlay,gridNoise:x=e$.params.gridNoise,floodC:y=e$.params.floodC,floodM:b=e$.params.floodM,floodY:S=e$.params.floodY,floodK:C=e$.params.floodK,gainC:w=e$.params.gainC,gainM:k=e$.params.gainM,gainY:z=e$.params.gainY,gainK:B=e$.params.gainK,type:O=e$.params.type,fit:F=e$.params.fit,scale:U=e$.params.scale,rotation:V=e$.params.rotation,originX:R=e$.params.originX,originY:M=e$.params.originY,offsetX:P=e$.params.offsetX,offsetY:Y=e$.params.offsetY,worldWidth:I=e$.params.worldWidth,worldHeight:A=e$.params.worldHeight,...N}){let X={u_image:m,u_noiseTexture:(0,l.getShaderNoiseTexture)(),u_colorBack:(0,s.getShaderColorFromString)(t),u_colorC:(0,s.getShaderColorFromString)(r),u_colorM:(0,s.getShaderColorFromString)(n),u_colorY:(0,s.getShaderColorFromString)(f),u_colorK:(0,s.getShaderColorFromString)(c),u_size:p,u_contrast:d,u_softness:g,u_grainSize:v,u_grainMixer:h,u_grainOverlay:_,u_gridNoise:x,u_floodC:y,u_floodM:b,u_floodY:S,u_floodK:C,u_gainC:w,u_gainM:k,u_gainY:z,u_gainK:B,u_type:eq[O],u_fit:i.ShaderFitOptions[F],u_rotation:V,u_scale:U,u_offsetX:P,u_offsetY:Y,u_originX:R,u_originY:M,u_worldWidth:I,u_worldHeight:A};return(0,u.jsx)(e.ShaderMount,{...N,speed:o,frame:a,fragmentShader:eH,uniforms:X})},r.colorPropsAreEqual);var eK=o.i(26726),eJ=o.i(62152),eQ=o.i(61682);o.s([],63967),o.i(63967),o.s(["ColorPanels",()=>oE,"Dithering",()=>oR,"DotGrid",()=>U,"DotOrbit",()=>k,"FlutedGlass",()=>ec,"GodRays",()=>ou.GodRays,"GrainGradient",()=>oN,"HalftoneCmyk",()=>eE,"HalftoneDots",()=>eG,"Heatmap",()=>eR,"ImageDithering",()=>eb,"LiquidMetal",()=>eN,"MeshGradient",()=>a.MeshGradient,"Metaballs",()=>D,"NeuroNoise",()=>x,"PaperTexture",()=>et,"PerlinNoise",()=>J,"PulsingBorder",()=>oG,"ShaderMount",()=>e.ShaderMount,"SimplexNoise",()=>I,"SmokeRing",()=>g,"Spiral",()=>ov,"StaticMeshGradient",()=>o1,"StaticRadialGradient",()=>o9,"Swirl",()=>oS,"Voronoi",()=>or,"Warp",()=>oc,"Water",()=>ev,"Waves",()=>$,"colorPanelsMeta",()=>oH,"colorPanelsPresets",()=>oL,"ditheringPresets",()=>oV,"dotGridPresets",()=>F,"dotOrbitMeta",()=>y,"dotOrbitPresets",()=>w,"flutedGlassPresets",()=>ef,"getShaderColorFromString",()=>s.getShaderColorFromString,"godRaysMeta",()=>eJ.godRaysMeta,"godRaysPresets",()=>ou.godRaysPresets,"grainGradientMeta",()=>oM,"grainGradientPresets",()=>oA,"halftoneCmykPresets",()=>eL,"halftoneDotsPresets",()=>eD,"heatmapMeta",()=>eS,"heatmapPresets",()=>eV,"imageDitheringPresets",()=>ey,"isPaperShaderElement",()=>eK.isPaperShaderElement,"liquidMetalPresets",()=>eA,"meshGradientMeta",()=>eQ.meshGradientMeta,"meshGradientPresets",()=>a.meshGradientPresets,"metaballsMeta",()=>A,"metaballsPresets",()=>j,"neuroNoisePresets",()=>_,"paperTexturePresets",()=>ea,"perlinNoisePresets",()=>K,"pulsingBorderMeta",()=>oX,"pulsingBorderPresets",()=>oD,"simplexNoiseMeta",()=>V,"simplexNoisePresets",()=>Y,"smokeRingMeta",()=>f,"smokeRingPresets",()=>d,"spiralPresets",()=>og,"staticMeshGradientMeta",()=>oK,"staticMeshGradientPresets",()=>o0,"staticRadialGradientMeta",()=>o2,"staticRadialGradientPresets",()=>o8,"swirlMeta",()=>oh,"swirlPresets",()=>ob,"voronoiMeta",()=>Q,"voronoiPresets",()=>ot,"warpMeta",()=>oi,"warpPresets",()=>of,"waterPresets",()=>eg,"wavesPresets",()=>q],3226)},4456,o=>{o.n(o.i(3226))}]);