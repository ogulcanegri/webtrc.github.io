const startButton = document.getElementById('startButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
let localStream;
let remoteStream;
let pc;

startButton.addEventListener('click', start);

async function start() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
        localVideo.srcObject = stream;
        localStream = stream;
        
        const configuration = {};
        pc = new RTCPeerConnection(configuration);
        pc.addEventListener('icecandidate', handleIceCandidate);
        pc.addEventListener('track', handleTrack);
        
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        // offer'ı bir sunucuya gönderip, diğer kullanıcıya ulaştırabilirsiniz.
    } catch (error) {
        console.error('Hata:', error);
    }
}

async function handleIceCandidate(event) {
    try {
        await pc.addIceCandidate(event.candidate);
    } catch (error) {
        console.error('Ice candidate hatası:', error);
    }
}

function handleTrack(event) {
    remoteVideo.srcObject = event.streams[0];
    remoteStream = event.streams[0];
}
