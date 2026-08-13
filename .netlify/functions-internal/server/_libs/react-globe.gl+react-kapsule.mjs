import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { n as require_react } from "./@radix-ui/react-compose-refs+[...].mjs";
import { t as omit } from "./jerrypick.mjs";
import { t as globe } from "./globe.gl+[...].mjs";
import { t as require_prop_types } from "./prop-types.mjs";
//#region node_modules/react-kapsule/dist/react-kapsule.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function index(kapsuleComponent, { wrapperElementType = "div", nodeMapper = (node) => node, methodNames = [], initPropNames = [] } = {}) {
	return /*#__PURE__*/ (0, import_react.forwardRef)((props, ref) => {
		const domEl = (0, import_react.useRef)();
		const comp = (0, import_react.useMemo)(() => {
			return kapsuleComponent(Object.fromEntries(initPropNames.filter((p) => props.hasOwnProperty(p)).map((prop) => [prop, props[prop]])));
		}, []);
		useEffectOnce(() => {
			comp(nodeMapper(domEl.current));
		}, import_react.useLayoutEffect);
		useEffectOnce(() => {
			return comp._destructor instanceof Function ? comp._destructor : void 0;
		});
		const _call = (0, import_react.useCallback)((method, ...args) => comp[method] instanceof Function ? comp[method](...args) : void 0, [comp]);
		const prevPropsRef = (0, import_react.useRef)({});
		Object.keys(omit(props, [...methodNames, ...initPropNames])).filter((p) => prevPropsRef.current[p] !== props[p]).forEach((p) => _call(p, props[p]));
		prevPropsRef.current = props;
		(0, import_react.useImperativeHandle)(ref, () => Object.fromEntries(methodNames.map((method) => [method, (...args) => _call(method, ...args)])), [_call]);
		return /*#__PURE__*/ import_react.createElement(wrapperElementType, { ref: domEl });
	});
}
function useEffectOnce(effect, useEffectFn = import_react.useEffect) {
	const destroyFunc = (0, import_react.useRef)();
	const effectCalled = (0, import_react.useRef)(false);
	const renderAfterCalled = (0, import_react.useRef)(false);
	const [val, setVal] = (0, import_react.useState)(0);
	if (effectCalled.current) renderAfterCalled.current = true;
	useEffectFn(() => {
		if (!effectCalled.current) {
			destroyFunc.current = effect();
			effectCalled.current = true;
		}
		setVal((val) => val + 1);
		return () => {
			if (!renderAfterCalled.current) return;
			if (destroyFunc.current) destroyFunc.current();
			destroyFunc.current = void 0;
			effectCalled.current = false;
			renderAfterCalled.current = false;
		};
	}, []);
}
//#endregion
//#region node_modules/react-globe.gl/dist/react-globe.gl.mjs
var react_globe_gl_exports = /* @__PURE__ */ __exportAll({ default: () => Globe });
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
var GlobePropTypes = {
	width: import_prop_types.default.number,
	height: import_prop_types.default.number,
	globeOffset: import_prop_types.default.arrayOf(import_prop_types.default.number),
	backgroundColor: import_prop_types.default.string,
	backgroundImageUrl: import_prop_types.default.string,
	globeImageUrl: import_prop_types.default.string,
	bumpImageUrl: import_prop_types.default.string,
	globeTileEngineUrl: import_prop_types.default.func,
	showGlobe: import_prop_types.default.bool,
	showGraticules: import_prop_types.default.bool,
	showAtmosphere: import_prop_types.default.bool,
	atmosphereColor: import_prop_types.default.string,
	atmosphereAltitude: import_prop_types.default.number,
	globeMaterial: import_prop_types.default.object,
	onGlobeReady: import_prop_types.default.func,
	onGlobeClick: import_prop_types.default.func,
	onGlobeRightClick: import_prop_types.default.func,
	pointsData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	pointLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pointLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pointColor: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	pointAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pointRadius: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pointResolution: import_prop_types.default.number,
	pointsMerge: import_prop_types.default.bool,
	pointsTransitionDuration: import_prop_types.default.number,
	pointLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onPointClick: import_prop_types.default.func,
	onPointRightClick: import_prop_types.default.func,
	onPointHover: import_prop_types.default.func,
	arcsData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	arcStartLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcStartLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcEndLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcEndLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcColor: import_prop_types.default.oneOfType([
		import_prop_types.default.string,
		import_prop_types.default.arrayOf(import_prop_types.default.string),
		import_prop_types.default.func
	]),
	arcAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcAltitudeAutoScale: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcStroke: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcCurveResolution: import_prop_types.default.number,
	arcCircularResolution: import_prop_types.default.number,
	arcDashLength: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcDashGap: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcDashInitialGap: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcDashAnimateTime: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	arcsTransitionDuration: import_prop_types.default.number,
	arcLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onArcClick: import_prop_types.default.func,
	onArcRightClick: import_prop_types.default.func,
	onArcHover: import_prop_types.default.func,
	polygonsData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	polygonGeoJsonGeometry: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	polygonCapColor: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	polygonCapMaterial: import_prop_types.default.oneOfType([
		import_prop_types.default.object,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	polygonSideColor: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	polygonSideMaterial: import_prop_types.default.oneOfType([
		import_prop_types.default.object,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	polygonStrokeColor: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	polygonAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	polygonCapCurvatureResolution: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	polygonsTransitionDuration: import_prop_types.default.number,
	polygonLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onPolygonClick: import_prop_types.default.func,
	onPolygonRightClick: import_prop_types.default.func,
	onPolygonHover: import_prop_types.default.func,
	pathsData: import_prop_types.default.array,
	pathPoints: import_prop_types.default.oneOfType([
		import_prop_types.default.array,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pathPointLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pathPointLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pathPointAlt: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pathResolution: import_prop_types.default.number,
	pathColor: import_prop_types.default.oneOfType([
		import_prop_types.default.string,
		import_prop_types.default.arrayOf(import_prop_types.default.string),
		import_prop_types.default.func
	]),
	pathStroke: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pathDashLength: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pathDashGap: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pathDashInitialGap: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pathDashAnimateTime: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	pathTransitionDuration: import_prop_types.default.number,
	pathLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onPathClick: import_prop_types.default.func,
	onPathRightClick: import_prop_types.default.func,
	onPathHover: import_prop_types.default.func,
	heatmapsData: import_prop_types.default.array,
	heatmapPoints: import_prop_types.default.oneOfType([
		import_prop_types.default.array,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	heatmapPointLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	heatmapPointLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	heatmapPointWeight: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	heatmapBandwidth: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	heatmapColorFn: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	heatmapColorSaturation: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	heatmapBaseAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	heatmapTopAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	heatmapsTransitionDuration: import_prop_types.default.number,
	onHeatmapClick: import_prop_types.default.func,
	onHeatmapRightClick: import_prop_types.default.func,
	onHeatmapHover: import_prop_types.default.func,
	hexBinPointsData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	hexBinPointLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	hexBinPointLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	hexBinPointWeight: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	hexBinResolution: import_prop_types.default.number,
	hexMargin: import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.func]),
	hexTopColor: import_prop_types.default.func,
	hexSideColor: import_prop_types.default.func,
	hexAltitude: import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.func]),
	hexTopCurvatureResolution: import_prop_types.default.number,
	hexBinMerge: import_prop_types.default.bool,
	hexTransitionDuration: import_prop_types.default.number,
	hexLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onHexClick: import_prop_types.default.func,
	onHexRightClick: import_prop_types.default.func,
	onHexHover: import_prop_types.default.func,
	hexPolygonsData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	hexPolygonGeoJsonGeometry: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	hexPolygonColor: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	hexPolygonAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	hexPolygonResolution: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	hexPolygonMargin: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	hexPolygonUseDots: import_prop_types.default.oneOfType([
		import_prop_types.default.bool,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	hexPolygonCurvatureResolution: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	hexPolygonDotResolution: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	hexPolygonsTransitionDuration: import_prop_types.default.number,
	hexPolygonLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onHexPolygonClick: import_prop_types.default.func,
	onHexPolygonRightClick: import_prop_types.default.func,
	onHexPolygonHover: import_prop_types.default.func,
	tilesData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	tileLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	tileLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	tileAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	tileWidth: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	tileHeight: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	tileUseGlobeProjection: import_prop_types.default.oneOfType([
		import_prop_types.default.bool,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	tileMaterial: import_prop_types.default.oneOfType([
		import_prop_types.default.object,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	tileCurvatureResolution: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	tilesTransitionDuration: import_prop_types.default.number,
	tileLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onTileClick: import_prop_types.default.func,
	onTileRightClick: import_prop_types.default.func,
	onTileHover: import_prop_types.default.func,
	particlesData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	particlesList: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	particleLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	particleLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	particleAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	particlesSize: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	particlesSizeAttenuation: import_prop_types.default.oneOfType([
		import_prop_types.default.bool,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	particlesColor: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	particlesTexture: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	particleLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onParticleClick: import_prop_types.default.func,
	onParticleRightClick: import_prop_types.default.func,
	onParticleHover: import_prop_types.default.func,
	ringsData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	ringLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	ringLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	ringAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	ringColor: import_prop_types.default.oneOfType([
		import_prop_types.default.string,
		import_prop_types.default.arrayOf(import_prop_types.default.string),
		import_prop_types.default.func
	]),
	ringResolution: import_prop_types.default.number,
	ringMaxRadius: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	ringPropagationSpeed: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	ringRepeatPeriod: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	labelsData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	labelLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	labelLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	labelAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	labelRotation: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	labelText: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	labelSize: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	labelTypeFace: import_prop_types.default.object,
	labelColor: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	labelResolution: import_prop_types.default.number,
	labelIncludeDot: import_prop_types.default.oneOfType([
		import_prop_types.default.bool,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	labelDotRadius: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	labelDotOrientation: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	labelsTransitionDuration: import_prop_types.default.number,
	labelLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onLabelClick: import_prop_types.default.func,
	onLabelRightClick: import_prop_types.default.func,
	onLabelHover: import_prop_types.default.func,
	htmlElementsData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	htmlLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	htmlLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	htmlAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	htmlElement: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	htmlElementVisibilityModifier: import_prop_types.default.func,
	htmlTransitionDuration: import_prop_types.default.number,
	objectsData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	objectLat: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	objectLng: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	objectAltitude: import_prop_types.default.oneOfType([
		import_prop_types.default.number,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	objectRotation: import_prop_types.default.oneOfType([
		import_prop_types.default.shape({
			x: import_prop_types.default.number,
			y: import_prop_types.default.number,
			z: import_prop_types.default.number
		}),
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	objectFacesSurface: import_prop_types.default.oneOfType([
		import_prop_types.default.bool,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	objectThreeObject: import_prop_types.default.oneOfType([
		import_prop_types.default.object,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	objectLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onObjectClick: import_prop_types.default.func,
	onObjectRightClick: import_prop_types.default.func,
	onObjectHover: import_prop_types.default.func,
	customLayerData: import_prop_types.default.arrayOf(import_prop_types.default.object),
	customThreeObject: import_prop_types.default.oneOfType([
		import_prop_types.default.object,
		import_prop_types.default.string,
		import_prop_types.default.func
	]),
	customThreeObjectUpdate: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	customLayerLabel: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.func]),
	onCustomLayerClick: import_prop_types.default.func,
	onCustomLayerRightClick: import_prop_types.default.func,
	onCustomLayerHover: import_prop_types.default.func,
	enablePointerInteraction: import_prop_types.default.bool,
	pointerEventsFilter: import_prop_types.default.func,
	lineHoverPrecision: import_prop_types.default.number,
	showPointerCursor: import_prop_types.default.oneOfType([import_prop_types.default.bool, import_prop_types.default.func]),
	onZoom: import_prop_types.default.func
};
var Globe = index(globe, {
	methodNames: [
		"pauseAnimation",
		"resumeAnimation",
		"pointOfView",
		"lights",
		"scene",
		"camera",
		"renderer",
		"postProcessingComposer",
		"controls",
		"getGlobeRadius",
		"getCoords",
		"getScreenCoords",
		"toGeoCoords",
		"toGlobeCoords",
		"globeTileEngineClearCache"
	],
	initPropNames: [
		"animateIn",
		"waitForGlobeReady",
		"rendererConfig"
	]
});
Globe.displayName = "Globe";
Globe.propTypes = GlobePropTypes;
//#endregion
export { react_globe_gl_exports as t };
