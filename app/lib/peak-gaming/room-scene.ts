import type { ZoneKey } from "./room-zones";

declare global {
  interface Window {
    THREE?: typeof import("three");
  }
}

interface RoomSceneHandle {
  highlightZone: (zone: ZoneKey | null) => void;
  destroy: () => void;
}

export function mountRoomScene(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  onZoneHover: (zone: ZoneKey | null) => void,
): RoomSceneHandle | null {
  if (!window.THREE) return null;
  const THREE: typeof import("three") = window.THREE;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  const S = new THREE.Scene();
  const C = new THREE.PerspectiveCamera(30, 16 / 11, 1, 240);
  C.position.set(0, 23, 33);
  C.lookAt(0, 1.4, -0.5);

  const world = new THREE.Group();
  S.add(world);
  S.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xbfffd8, 0.8);
  key.position.set(-9, 17, 12);
  S.add(key);
  const rimLight = new THREE.DirectionalLight(0xff2e45, 0.55);
  rimLight.position.set(11, 8, -9);
  S.add(rimLight);

  const mDark = new THREE.MeshLambertMaterial({ color: 0x171226 });
  const mDark2 = new THREE.MeshLambertMaterial({ color: 0x0f0b1c });
  const mSeat = new THREE.MeshLambertMaterial({ color: 0x241b3c });
  const V = 0x25e37a;
  const X = 0xff2e45;
  const glow = (c: number) => new THREE.MeshBasicMaterial({ color: c });
  const W = 11;
  const Dp = 7.5; // half width / half depth

  // floor
  const fl = new THREE.Mesh(
    new THREE.BoxGeometry(W * 2, 0.3, Dp * 2),
    new THREE.MeshLambertMaterial({ color: 0x0c0918 }),
  );
  fl.position.y = -0.15;
  world.add(fl);

  // dark brick wall texture, matching the venue
  const brick = (function makeBrickTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#0E0A18";
    g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 8; r++) {
      const off = r % 2 ? 32 : 0;
      for (let i = -1; i < 5; i++) {
        const x = off + i * 64;
        const y = r * 32;
        g.fillStyle = `rgb(${20 + Math.random() * 12},${14 + Math.random() * 8},${28 + Math.random() * 12})`;
        g.fillRect(x + 2, y + 2, 60, 28);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(6, 1.4);
    return t;
  })();
  const wallM = new THREE.MeshLambertMaterial({ color: 0x1a1428, map: brick });
  const wb = new THREE.Mesh(new THREE.BoxGeometry(W * 2, 4.6, 0.3), wallM);
  wb.position.set(0, 2.3, -Dp - 0.15);
  world.add(wb);
  const wl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.6, Dp * 2), wallM);
  wl.position.set(-W - 0.15, 2.3, 0);
  world.add(wl);
  const wr = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.6, Dp * 2), wallM);
  wr.position.set(W + 0.15, 2.3, 0);
  world.add(wr);

  // LED strips — red and green, matching the venue
  const led = (
    w: number,
    hh: number,
    d: number,
    x: number,
    y: number,
    z: number,
    c: number,
  ) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), glow(c));
    m.position.set(x, y, z);
    world.add(m);
    return m;
  };
  led(W * 2 - 0.4, 0.14, 0.14, 0, 4.2, -Dp, X);
  led(0.14, 0.14, Dp * 2 - 0.3, -W, 4.2, 0, X);
  led(0.14, 0.14, Dp * 2 - 0.3, W, 4.2, 0, V);
  [-8.5, 8.5].forEach((x) => led(0.16, 3.6, 0.16, x, 2.1, -Dp + 0.1, V));

  // vertical tubes on the side walls — the red columns from the photos
  function tube(x: number, z: number, col: number) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.4, 10), glow(col));
    t.position.set(x, 1.75, z);
    world.add(t);
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 3.6),
      new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    halo.position.set(x + (x < 0 ? 0.2 : -0.2), 1.75, z);
    halo.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
    world.add(halo);
  }
  [-6.2, -1.6, 3.0].forEach((z) => {
    tube(-W + 0.25, z, X);
    tube(W - 0.25, z, X);
  });
  tube(-W + 0.25, 6.0, V);
  tube(W - 0.25, 6.0, V);

  // crest, on the back wall
  (function addCrest() {
    const el = document.querySelector<HTMLImageElement>(".book .crest");
    if (!el) return;
    const tx = new THREE.TextureLoader().load(el.currentSrc || el.src);
    const sg = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.33),
      new THREE.MeshBasicMaterial({
        map: tx,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    sg.position.set(0, 3.05, -Dp + 0.06);
    world.add(sg);
  })();

  interface Zone {
    g: InstanceType<typeof THREE.Group>;
    pads: InstanceType<typeof THREE.Mesh>[];
    lights: InstanceType<typeof THREE.Mesh>[];
    lift?: number;
  }
  const zones: Partial<Record<ZoneKey, Zone>> = {};
  function zone(k: ZoneKey) {
    const g = new THREE.Group();
    g.userData.k = k;
    world.add(g);
    zones[k] = { g, pads: [], lights: [] };
    return g;
  }
  function pad(k: ZoneKey, w: number, d: number, x: number, z: number) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.06, d),
      new THREE.MeshBasicMaterial({ color: V, transparent: true, opacity: 0.12 }),
    );
    m.position.set(x, 0.02, z);
    zones[k]!.g.add(m);
    zones[k]!.pads.push(m);
  }
  // screen faces +z locally, then the group rotates
  function screen(
    g: InstanceType<typeof THREE.Group>,
    zk: ZoneKey,
    w: number,
    hh: number,
    x: number,
    y: number,
    z: number,
    col: number,
  ) {
    const bez = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, hh + 0.12, 0.09), mDark2);
    bez.position.set(x, y, z);
    g.add(bez);
    const sc = new THREE.Mesh(
      new THREE.PlaneGeometry(w, hh),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.85, side: THREE.DoubleSide }),
    );
    sc.position.set(x, y, z + 0.06);
    g.add(sc);
    zones[zk]!.lights.push(sc);
  }
  const fcImg = document.querySelector<HTMLImageElement>('.sheet img[alt*="meniul"]');
  const tvTex = new THREE.TextureLoader().load(fcImg ? fcImg.currentSrc || fcImg.src : "");
  function tvScreen(
    g: InstanceType<typeof THREE.Group>,
    zk: ZoneKey,
    w: number,
    hh: number,
    x: number,
    y: number,
    z: number,
  ) {
    const bez = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.1, hh + 0.1, 0.08),
      new THREE.MeshLambertMaterial({ color: 0x07060c }),
    );
    bez.position.set(x, y, z);
    g.add(bez);
    const sc = new THREE.Mesh(
      new THREE.PlaneGeometry(w, hh),
      new THREE.MeshBasicMaterial({ map: tvTex, transparent: true, opacity: 0.95 }),
    );
    sc.position.set(x, y, z + 0.06);
    g.add(sc);
    zones[zk]!.lights.push(sc);
  }
  const mChair = new THREE.MeshLambertMaterial({ color: 0x1c1020 });
  function chair(g: InstanceType<typeof THREE.Group>, x: number, z: number) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.15, 0.72), mChair);
    s.position.set(x, 0.55, z);
    g.add(s);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.95, 0.15), mChair);
    b.position.set(x, 1.05, z + 0.34);
    g.add(b);
    [-0.3, 0.3].forEach((o) => {
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.9, 0.03), glow(X));
      st.position.set(x + o, 1.05, z + 0.27);
      g.add(st);
    }); // red stripes on the backrest
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 8), mDark2);
    p.position.set(x, 0.28, z);
    g.add(p);
    const bs = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 12), mDark2);
    bs.position.set(x, 0.04, z);
    g.add(bs);
  }

  // ---- RIGHT: 9 PCs, two back-to-back rows ----
  zone("pc");
  pad("pc", 3.8, 14.2, 8.9, 0);
  function pcRow(xDesk: number, dir: number, zs: number[]) {
    // dir: +1 screen faces +x
    zs.forEach((z) => {
      const g = new THREE.Group();
      g.position.set(xDesk, 0, z);
      g.rotation.y = (dir * Math.PI) / 2;
      const d = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.9), mDark);
      d.position.y = 0.78;
      g.add(d);
      [-0.63, 0.63].forEach((o) => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.78, 0.1), mDark2);
        l.position.set(o, 0.39, 0);
        g.add(l);
      });
      screen(g, "pc", 1.1, 0.62, 0, 1.26, 0.32, 0x25e37a);
      const kb = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.04, 0.22), glow(V));
      kb.position.set(0, 0.87, -0.1);
      g.add(kb);
      chair(g, 0, 1.25);
      zones.pc!.g.add(g);
    });
  }
  pcRow(9.3, -1, [-6.2, -4.65, -3.1, -1.55, 0, 1.55, 3.1, 4.65, 6.2]);

  // ---- LEFT: 5 PlayStation pods ----
  zone("ps5");
  pad("ps5", 4.6, 12.8, -9.0, -0.4);
  [-5.6, -3.0, -0.4, 2.2, 4.8].forEach((z) => {
    const g = new THREE.Group();
    g.position.set(-9.3, 0, z);
    g.rotation.y = Math.PI / 2;
    const mnt = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.22), mDark2);
    mnt.position.set(0, 1.75, -0.98);
    g.add(mnt);
    tvScreen(g, "ps5", 2.1, 1.22, 0, 1.78, -0.86);
    const ps = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.72, 0.4),
      new THREE.MeshLambertMaterial({ color: 0xefebfa }),
    );
    ps.position.set(1.0, 0.36, -0.88);
    g.add(ps);
    const psl = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.5, 0.42), glow(0x7fd8ff));
    psl.position.set(0.9, 0.36, -0.88);
    g.add(psl);
    const tb = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.5), mDark);
    tb.position.set(0, 0.5, -0.85);
    g.add(tb);
    const so = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 0.8), mSeat);
    so.position.set(0, 0.4, 0.9);
    g.add(so);
    const bk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 0.16), mSeat);
    bk.position.set(0, 0.72, 1.32);
    g.add(bk);
    zones.ps5!.g.add(g);
  });

  // ---- BACK, CENTER: the racing rig, under the crest ----
  zone("volan");
  pad("volan", 5.4, 4.6, 0, -5.4);
  (function addRacingRig() {
    const g = zones.volan!.g;
    const mFrame = new THREE.MeshLambertMaterial({ color: 0x1e1526 });
    const mRed = new THREE.MeshLambertMaterial({ color: 0x4a121c });
    const put = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      geo: any,
      mat: InstanceType<typeof THREE.Material>,
      x: number,
      y: number,
      z: number,
      rx?: number,
      ry?: number,
    ) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      if (rx) m.rotation.x = rx;
      if (ry) m.rotation.y = ry;
      g.add(m);
      return m;
    };

    // chassis: two rails + crossbar
    [-0.62, 0.62].forEach((o) => put(new THREE.BoxGeometry(0.14, 0.16, 2.6), mFrame, o, 0.16, -5.3));
    put(new THREE.BoxGeometry(1.4, 0.12, 0.16), mFrame, 0, 0.16, -6.4);

    // bucket seat: base, backrest, two side wings
    put(new THREE.BoxGeometry(0.86, 0.18, 0.9), mRed, 0, 0.5, -4.72);
    put(new THREE.BoxGeometry(0.86, 1.3, 0.2), mRed, 0, 1.16, -4.2, 0.14);
    [-0.44, 0.44].forEach((o) => put(new THREE.BoxGeometry(0.13, 1.0, 0.34), mRed, o, 1.06, -4.36, 0.14));
    [-0.36, 0.36].forEach((o) => put(new THREE.BoxGeometry(0.12, 0.2, 0.62), mRed, o, 0.58, -4.9));
    put(new THREE.BoxGeometry(0.5, 0.26, 0.16), mFrame, 0, 1.75, -4.12, 0.14); // headrest

    // wheel console
    put(new THREE.BoxGeometry(0.9, 0.1, 0.5), mFrame, 0, 0.95, -5.95, -0.22);
    put(new THREE.BoxGeometry(0.16, 0.8, 0.16), mFrame, 0, 0.55, -5.95);

    // the wheel: vertical, tilted slightly toward the driver
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.055, 10, 26), glow(X));
    rim.position.set(0, 1.24, -5.86);
    rim.rotation.x = -0.28;
    g.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.07, 10), mFrame);
    hub.position.set(0, 1.24, -5.86);
    hub.rotation.x = Math.PI / 2 - 0.28;
    g.add(hub);
    [-1, 1].forEach((sgn) => {
      // spokes
      const sp = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.045, 0.03), mFrame);
      sp.position.set(sgn * 0.14, 1.22, -5.86);
      sp.rotation.x = -0.28;
      sp.rotation.z = sgn * 0.18;
      g.add(sp);
    });
    const sp3 = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.24, 0.03), mFrame);
    sp3.position.set(0, 1.13, -5.83);
    sp3.rotation.x = -0.28;
    g.add(sp3);

    // pedals and shifter
    [-0.2, 0.2].forEach((o) => put(new THREE.BoxGeometry(0.16, 0.04, 0.3), mFrame, o, 0.3, -6.25, -0.38));
    put(new THREE.BoxGeometry(0.08, 0.34, 0.08), mFrame, 0.62, 0.75, -5.3);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), glow(X));
    knob.position.set(0.62, 0.95, -5.3);
    g.add(knob);

    // the screen, on a stand
    put(new THREE.BoxGeometry(0.7, 0.08, 0.4), mFrame, 0, 0.06, -6.95);
    put(new THREE.BoxGeometry(0.12, 1.1, 0.12), mFrame, 0, 0.6, -6.95);
    tvScreen(g, "volan", 2.3, 1.3, 0, 1.75, -6.9);
  })();

  // ---- ENTRANCE, CENTER: the bar ----
  zone("bar");
  pad("bar", 7.6, 3.8, 0, 5.4);
  (function addBar() {
    const g = zones.bar!.g;
    const cnt = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.05, 0.9), mDark);
    cnt.position.set(0, 0.52, 5.4);
    g.add(cnt);
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.1, 1.05),
      new THREE.MeshLambertMaterial({ color: 0x231a3d }),
    );
    top.position.set(0, 1.08, 5.4);
    g.add(top);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.07, 0.07), glow(X));
    strip.position.set(0, 0.62, 4.93);
    g.add(strip);
    [-2.3, 0, 2.3].forEach((x) => {
      const fr = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.9, 0.7), mDark2);
      fr.position.set(x, 0.95, 6.7);
      g.add(fr);
      const gl = new THREE.Mesh(
        new THREE.PlaneGeometry(1.0, 1.5),
        new THREE.MeshBasicMaterial({ color: 0x25e37a, transparent: true, opacity: 0.62 }),
      );
      gl.position.set(x, 1.0, 6.33);
      g.add(gl);
      zones.bar!.lights.push(gl);
    });
    [-2.1, 0, 2.1].forEach((x) => {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.12, 12), mSeat);
      s.position.set(x, 0.85, 4.3);
      g.add(s);
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 8), mDark2);
      p.position.set(x, 0.42, 4.3);
      g.add(p);
    });
  })();

  function highlight(k: ZoneKey | null) {
    (Object.keys(zones) as ZoneKey[]).forEach((z) => {
      const on = z === k;
      const zone = zones[z]!;
      zone.pads.forEach((p) => {
        (p.material as InstanceType<typeof THREE.MeshBasicMaterial>).color.setHex(on ? X : V);
        (p.material as InstanceType<typeof THREE.MeshBasicMaterial>).opacity = on ? 0.36 : 0.12;
      });
      zone.lift = on ? 0.22 : 0;
    });
  }

  // interaction: drag to rotate, hover to select
  let rotY = -0.34;
  let rotTarget = -0.34;
  let dragging = false;
  let px = 0;
  let auto = !reduce;
  let lastMove = 0;
  const ray = new THREE.Raycaster();
  const pt = new THREE.Vector2();
  function zoneAt(ev: PointerEvent): ZoneKey | null {
    const r = canvas.getBoundingClientRect();
    pt.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    pt.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(pt, C);
    const hit = ray.intersectObjects(world.children, true);
    for (const hh of hit) {
      let o: InstanceType<typeof THREE.Object3D> | null = hh.object;
      while (o && o !== world) {
        if (o.userData.k) return o.userData.k as ZoneKey;
        o = o.parent;
      }
    }
    return null;
  }

  const onPointerDown = (e: PointerEvent) => {
    dragging = true;
    px = e.clientX;
    auto = false;
    container.classList.add("drag");
    canvas.setPointerCapture(e.pointerId);
  };
  const onPointerUp = () => {
    dragging = false;
    container.classList.remove("drag");
  };
  const onPointerLeave = () => {
    dragging = false;
    container.classList.remove("drag");
  };
  const onPointerMove = (e: PointerEvent) => {
    if (dragging) {
      rotTarget += (e.clientX - px) * 0.008;
      px = e.clientX;
      return;
    }
    const now = performance.now();
    if (now - lastMove < 60) return;
    lastMove = now;
    const k = zoneAt(e);
    if (k) onZoneHover(k);
  };
  const onPointerCancel = () => {
    dragging = false;
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointercancel", onPointerCancel);

  function size() {
    const w = container.clientWidth;
    const hh = container.clientHeight;
    C.aspect = w / hh;
    C.updateProjectionMatrix();
    R.setSize(w, hh, false);
  }
  size();
  addEventListener("resize", size);

  let visible = true;
  const io = new IntersectionObserver((en) => {
    visible = en[0].isIntersecting;
  }, { threshold: 0.05 });
  io.observe(container);

  let raf = 0;
  let destroyed = false;
  (function tick(t: number) {
    if (destroyed) return;
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    if (auto) rotTarget = -0.34 + Math.sin(t * 0.00016) * 0.42; // slow sway, room stays visible
    rotY += (rotTarget - rotY) * 0.09;
    world.rotation.y = rotY;
    Object.values(zones).forEach((z) => {
      z!.g.position.y += ((z!.lift || 0) - z!.g.position.y) * 0.12;
      z!.lights.forEach((l, i) => {
        (l.material as InstanceType<typeof THREE.MeshBasicMaterial>).opacity =
          0.7 + Math.sin(t * 0.0018 + i * 1.7) * 0.14;
      });
    });
    R.render(S, C);
  })(0);

  return {
    highlightZone: highlight,
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
      io.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      R.dispose();
    },
  };
}
