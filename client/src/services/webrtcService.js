// STUN alone frequently fails to connect two peers on separate real-world
// networks (symmetric NAT, corporate/mobile networks, etc.) - it only helps
// when a direct path exists. A TURN relay is required as a fallback for the
// connection to work at all in those cases, which is the most likely reason
// audio/video/screen-share never reached other participants across networks.
// Override with your own TURN provider via VITE_TURN_URL / VITE_TURN_USERNAME /
// VITE_TURN_CREDENTIAL. Falls back to Open Relay Project's free public TURN
// (https://www.metered.ca/tools/openrelay/) so this works out of the box.
const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  {
    urls: import.meta.env.VITE_TURN_URL || "turn:openrelay.metered.ca:80",
    username: import.meta.env.VITE_TURN_USERNAME || "openrelayproject",
    credential: import.meta.env.VITE_TURN_CREDENTIAL || "openrelayproject",
  },
  {
    urls: import.meta.env.VITE_TURN_URL_TLS || "turn:openrelay.metered.ca:443?transport=tcp",
    username: import.meta.env.VITE_TURN_USERNAME || "openrelayproject",
    credential: import.meta.env.VITE_TURN_CREDENTIAL || "openrelayproject",
  },
];

class WebRTCService {
  constructor() {
    this.peerConnections = new Map();
  }

  createPeerConnection(peerId, onIceCandidate, onTrack) {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.onicecandidate = (event) => {
      if (event.candidate && onIceCandidate) {
        onIceCandidate(peerId, event.candidate);
      }
    };

    if (onTrack) {
      pc.ontrack = (event) => onTrack(peerId, event.streams[0]);
    }

    this.peerConnections.set(peerId, pc);
    return pc;
  }

  getConnection(peerId) {
    return this.peerConnections.get(peerId);
  }

  async createOffer(peerId) {
    const pc = this.getConnection(peerId);
    if (!pc) throw new Error(`No connection for peer ${peerId}`);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(peerId) {
    const pc = this.getConnection(peerId);
    if (!pc) throw new Error(`No connection for peer ${peerId}`);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }

  async setRemoteDescription(peerId, description) {
    const pc = this.getConnection(peerId);
    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(description));
  }

  async addIceCandidate(peerId, candidate) {
    const pc = this.getConnection(peerId);
    if (!pc || !candidate) return;
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }

  addLocalStream(peerId, stream) {
    const pc = this.getConnection(peerId);
    if (!pc) return;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  }

  closeConnection(peerId) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }
  }

  closeAll() {
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
  }
}

export default new WebRTCService();
