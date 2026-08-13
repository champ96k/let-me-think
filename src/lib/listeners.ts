export type Listener = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};

const _d = [
  [12.9716,77.5946,"QmFuZ2Fsb3JlPEluZGlhPg=="],
  [19.076,72.8777,"TXVtYmFpPEluZGlhPg=="],
  [28.7041,77.1025,"RGVsaGk8SW5kaWE+"],
  [18.5204,73.8567,"UHVuZTxJbmRpYT4="],
  [17.385,78.4867,"SHlkZXJhYmFkPEluZGlhPg=="],
  [13.0827,80.2707,"Q2hlbm5haTxJbmRpYT4="],
  [22.5726,88.3639,"S29sa2F0YTxJbmRpYT4="],
  [23.0225,72.5714,"QWhtZWRhYmFkPEluZGlhPg=="],
  [26.9124,75.7873,"SmFpcHVyPEluZGlhPg=="],
  [19.9975,73.7898,"TmFzaGlrPEluZGlhPg=="],
  [40.7128,-74.006,"TmV3IFlvcms8VVNBPg=="],
  [37.7749,-122.4194,"U2FuIEZyYW5jaXNjbzxVU0E+"],
  [41.8781,-87.6298,"Q2hpY2FnbzxVU0E+"],
  [39.7392,-104.9903,"RGVudmVyPFVTQT4="],
  [47.6062,-122.3321,"U2VhdHRsZTxVU0E+"],
  [30.2672,-97.7431,"QXVzdGluPFVTQT4="],
  [43.6532,-79.3832,"VG9yb250bzxDYW5hZGE+"],
  [49.2827,-123.1207,"VmFuY291dmVyPENhbmFkYT4="],
  [19.4326,-99.1332,"TWV4aWNvIENpdHk8TWV4aWNvPg=="],
  [-23.5505,-46.6333,"U8OjbyBQYXVsbzxCcmF6aWw+"],
  [-34.6037,-58.3816,"QnVlbm9zIEFpcmVzPEFyZ2VudGluYT4="],
  [4.711,-74.0721,"Qm9nb3TDoTxDb2xvbWJpYT4="],
  [6.2476,-75.5658,"TWVkZWxsw61uPENvbG9tYmlhPg=="],
  [51.5074,-0.1278,"TG9uZG9uPFVLPg=="],
  [48.8566,2.3522,"UGFyaXM8RnJhbmNlPg=="],
  [52.52,13.405,"QmVybGluPEdlcm1hbnk+"],
  [52.3676,4.9041,"QW1zdGVyZGFtPE5ldGhlcmxhbmRzPg=="],
  [40.4168,-3.7038,"TWFkcmlkPFNwYWluPg=="],
  [38.7223,-9.1393,"TGlzYm9uPFBvcnR1Z2FsPg=="],
  [41.9028,12.4964,"Um9tZTxJdGFseT4="],
  [48.2082,16.3738,"Vmllbm5hPEF1c3RyaWE+"],
  [50.0755,14.4378,"UHJhZ3VlPEN6ZWNoIFJlcHVibGljPg=="],
  [52.2297,21.0122,"V2Fyc2F3PFBvbGFuZD4="],
  [59.3293,18.0686,"U3RvY2tob2xtPFN3ZWRlbj4="],
  [60.1699,24.9384,"SGVsc2lua2k8RmlubGFuZD4="],
  [53.3498,-6.2603,"RHVibGluPElyZWxhbmQ+"],
  [55.6761,12.5683,"Q29wZW5oYWdlbjxEZW5tYXJrPg=="],
  [47.3769,8.5417,"WnVyaWNoPFN3aXR6ZXJsYW5kPg=="],
  [41.3874,2.1686,"QmFyY2Vsb25hPFNwYWluPg=="],
  [25.2048,55.2708,"RHViYWk8VUFFPg=="],
  [32.0853,34.7818,"VGVsIEF2aXY8SXNyYWVsPg=="],
  [41.0082,28.9784,"SXN0YW5idWw8VHVya2V5Pg=="],
  [30.0444,31.2357,"Q2Fpcm88RWd5cHQ+"],
  [-1.2921,36.8219,"TmFpcm9iaTxLZW55YT4="],
  [6.5244,3.3792,"TGFnb3M8TmlnZXJpYT4="],
  [-33.9249,18.4241,"Q2FwZSBUb3duPFNvdXRoIEFmcmljYT4="],
  [1.3521,103.8198,"U2luZ2Fwb3JlPFNpbmdhcG9yZT4="],
  [13.7563,100.5018,"QmFuZ2tvazxUaGFpbGFuZD4="],
  [3.139,101.6869,"S3VhbGEgTHVtcHVyPE1hbGF5c2lhPg=="],
  [-6.2088,106.8456,"SmFrYXJ0YTxJbmRvbmVzaWE+"],
  [10.8231,106.6297,"SG8gQ2hpIE1pbmggQ2l0eTxWaWV0bmFtPg=="],
  [35.6762,139.6503,"VG9reW88SmFwYW4+"],
  [34.6937,135.5023,"T3Nha2E8SmFwYW4+"],
  [37.5665,126.978,"U2VvdWw8U291dGggS29yZWE+"],
  [22.5431,114.0579,"U2hlbnpoZW48Q2hpbmE+"],
  [25.033,121.5654,"VGFpcGVpPFRhaXdhbj4="],
  [-33.8688,151.2093,"U3lkbmV5PEF1c3RyYWxpYT4="],
  [-37.8136,144.9631,"TWVsYm91cm5lPEF1c3RyYWxpYT4="],
  [-36.8485,174.7633,"QXVja2xhbmQ8TmV3IFplYWxhbmQ+"],
  [55.7558,37.6173,"TW9zY293PFJ1c3NpYT4="],
];

export const listeners: Listener[] = _d.map(([lat, lng, enc]) => {
  const raw = atob(enc as string);
  const sep = raw.indexOf("<");
  return {
    city: raw.substring(0, sep),
    country: raw.substring(sep + 1, raw.length - 1),
    lat: lat as number,
    lng: lng as number,
  };
});
