declare global {
  interface Window {
    THREE?: typeof import("three");
  }
}

export function mountHeroScene(canvas: HTMLCanvasElement): (() => void) | undefined {
  const THREE = window.THREE;
  if (!THREE) return undefined;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 760;

  const r = new THREE.WebGLRenderer({ canvas, antialias: !small });
  r.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  r.setSize(innerWidth, innerHeight);
  r.setClearColor(0x06050c, 1);

  const s = new THREE.Scene();
  s.fog = new THREE.FogExp2(0x06050c, 0.03);
  const cam = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 400);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 340),
    new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: `varying vec3 v;void main(){vec4 w=modelMatrix*vec4(position,1.);v=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
      fragmentShader: `varying vec3 v;float L(float c){float d=abs(fract(c+.5)-.5);return 1.-smoothstep(0.,.03,d);}
      void main(){float g=max(L(v.x*.35),L(v.z*.35));float sd=smoothstep(18.,3.,abs(v.x));
      float fr=1.-smoothstep(24.,130.,abs(v.z));gl_FragColor=vec4(.145,.89,.478,g*sd*fr*.45);}`,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -1.7, -110);
  s.add(floor);

  const gc = document.createElement("canvas");
  gc.width = gc.height = 128;
  const gx = gc.getContext("2d")!;
  const gr = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.4, "rgba(255,255,255,.3)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  gx.fillStyle = gr;
  gx.fillRect(0, 0, 128, 128);
  const gT = new THREE.CanvasTexture(gc);

  const pal = [0x25e37a, 0xff2e45, 0x5ff3a0, 0x25e37a, 0x25e37a];
  const dm = new THREE.MeshBasicMaterial({ color: 0x120e20 });
  const dg = new THREE.BoxGeometry(2.6, 0.12, 1.3);
  const lg = new THREE.BoxGeometry(0.12, 1.5, 0.12);
  const sg = new THREE.PlaneGeometry(2.05, 1.2);

  interface Screen {
    m: InstanceType<typeof THREE.MeshBasicMaterial>;
    sp: InstanceType<typeof THREE.Sprite>;
    seed: number;
  }
  const screens: Screen[] = [];
  const N = small ? 10 : 16;
  for (let i = 0; i < N; i++) {
    for (const sd of [-1, 1]) {
      const g2 = new THREE.Group();
      g2.position.set(sd * 3.6, 0, -i * 6 - 2);
      g2.rotation.y = sd > 0 ? -Math.PI / 2 : Math.PI / 2;
      const dk = new THREE.Mesh(dg, dm);
      dk.position.y = -0.6;
      g2.add(dk);
      for (const lx of [-1.1, 1.1]) {
        const l = new THREE.Mesh(lg, dm);
        l.position.set(lx, -1.35, 0);
        g2.add(l);
      }
      const col = pal[(i * 2 + (sd > 0 ? 1 : 0)) % pal.length];
      const m = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
      const sc = new THREE.Mesh(sg, m);
      sc.position.y = 0.15;
      sc.rotation.x = -0.06;
      g2.add(sc);
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: gT,
          color: col,
          transparent: true,
          opacity: 0.42,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      sp.scale.set(6.5, 4.5, 1);
      sp.position.set(0, 0.2, 0.25);
      g2.add(sp);
      s.add(g2);
      screens.push({ m, sp, seed: Math.random() * 10 });
    }
  }

  const stg = new THREE.BoxGeometry(0.13, 0.05, 4.6);
  for (let i = 0; i < N; i++) {
    const st = new THREE.Mesh(stg, new THREE.MeshBasicMaterial({ color: 0xff2e45, transparent: true, opacity: 0.45 }));
    st.position.set(0, 3.2, -i * 6 - 2);
    st.rotation.y = Math.PI / 2;
    s.add(st);
  }

  const ridge = new THREE.Mesh(
    new THREE.PlaneGeometry(340, 140),
    new THREE.ShaderMaterial({
      transparent: true,
      fog: false,
      depthWrite: false,
      vertexShader: `varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec2 u;float R(float x){return .33+.17*sin(x*2.3)+.10*sin(x*5.1+1.4)+.05*sin(x*9.7+2.6);}
      void main(){float h=R(u.x*3.1415);float m=step(u.y,h);float g=exp(-abs(u.y-h)*12.);
      vec3 c=mix(vec3(.015,.012,.035),vec3(.14,.09,.28),smoothstep(0.,.9,u.y));
      c+=vec3(1.,.18,.27)*g*.55;c=mix(c,vec3(.012,.01,.028),m);gl_FragColor=vec4(c,.9);}`,
    }),
  );
  ridge.position.set(0, 28, -120);
  s.add(ridge);

  let tp = 0;
  let cp = 0;
  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;
  const t0 = performance.now();

  const onScroll = () => {
    const m = document.body.scrollHeight - innerHeight;
    tp = m > 0 ? scrollY / m : 0;
  };
  addEventListener("scroll", onScroll, { passive: true });

  const onPointerMove = (e: PointerEvent) => {
    tx = e.clientX / innerWidth - 0.5;
    ty = e.clientY / innerHeight - 0.5;
  };
  if (!reduce) addEventListener("pointermove", onPointerMove, { passive: true });

  const onResize = () => {
    cam.aspect = innerWidth / innerHeight;
    cam.updateProjectionMatrix();
    r.setSize(innerWidth, innerHeight);
  };
  addEventListener("resize", onResize);

  let raf = 0;
  let destroyed = false;
  (function loop(t: number) {
    if (destroyed) return;
    raf = requestAnimationFrame(loop);
    cp += (tp - cp) * 0.055;
    mx += (tx - mx) * 0.045;
    my += (ty - my) * 0.045;
    let z = 9;
    if (!reduce) {
      const e = Math.min((t - t0) / 2400, 1);
      z = 26 + (9 - 26) * (1 - Math.pow(1 - e, 3));
    }
    cam.position.set(mx * 1.8, 1.5 - my * 0.55 + Math.sin(t * 0.0004) * 0.06, z - cp * 76);
    cam.lookAt(mx * 1.3, 1.25 - my * 0.45, cam.position.z - 13);
    if (!reduce) {
      for (const o of screens) {
        const f = 0.8 + Math.sin(t * 0.0016 + o.seed) * 0.08 + Math.sin(t * 0.012 + o.seed * 3) * 0.025;
        o.m.opacity = f;
        (o.sp.material as InstanceType<typeof THREE.SpriteMaterial>).opacity = 0.3 + (f - 0.8) * 1.2 + 0.12;
      }
    }
    r.render(s, cam);
  })(performance.now());

  return () => {
    destroyed = true;
    cancelAnimationFrame(raf);
    removeEventListener("scroll", onScroll);
    removeEventListener("pointermove", onPointerMove);
    removeEventListener("resize", onResize);
    r.dispose();
  };
}
