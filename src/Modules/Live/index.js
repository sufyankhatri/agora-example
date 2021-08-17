import React, { useEffect, useState } from 'react';
import {
  AgoraVideoPlayer,
  AgoraRTC,
  createClient,
  createMicrophoneAndCameraTracks,
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-react';
import { join } from 'path';

const config: ClientConfig = {
  mode: 'live',
  codec: 'vp8',
};
var localTracks = {
  videoTrack: null,
  audioTrack: null,
};
var options = {
  appid: '7c09a5c3cb8c430d9eb3b2c695dad0c6',
  channel: 'bcd',
  uid: '123',
  token:'0067c09a5c3cb8c430d9eb3b2c695dad0c6IAAakug0GrhOeHF2g69gToaR6PeKqNiYT+EI/MjrWCyrhMJBJDUAAAAAEAC+QOqNi2UbYQEAAQCLZRth',
  role: 'audience', // host or audience
  audienceLatency: 2,
};

var remoteUsers = {};
export const index = () => {
    const useClient = createClient(config);
    const client = useClient();
  const join = () => {
        // create Agora client
        client.setClientRole(options.role, {level: options.audienceLatency});
    
        if (options.role === "audience") {
            // add event listener to play remote tracks when remote user publishs.
            client.on("user-published", handleUserPublished);
            client.on("user-unpublished", handleUserUnpublished);
        }
    
        // join the channel
        options.uid = await client.join(options.appid, options.channel, options.token || null, options.uid || null);
    
        if (options.role === "host") {
            // create local audio and video tracks
            localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
            // play local video track
            localTracks.videoTrack.play("local-player");
            // $("#local-player-name").text(`localTrack(${options.uid})`);
            // publish local tracks to channel
            await client.publish(Object.values(localTracks));
            console.log("publish success");
        
    }


  };
  async function leave() {
    for (trackName in localTracks) {
        var track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            localTracks[trackName] = undefined;
        }
    }

    // remove remote users and player views
    remoteUsers = {};
    // $("#remote-playerlist").html("");

    // leave the channel
    await client.leave();

    // $("#local-player-name").text("");
    // $("#host-join").attr("disabled", false);
    // $("#audience-join").attr("disabled", false);
    // $("#leave").attr("disabled", true);
    console.log("client leaves channel success");
}

async function subscribe(user, mediaType) {
    const uid = user.uid;
    // subscribe to a remote user
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
    if (mediaType === 'video') {
    //     const player = $(`
    //   <div id="player-wrapper-${uid}">
    //     <p class="player-name">remoteUser(${uid})</p>
    //     <div id="player-${uid}" class="player"></div>
    //   </div>
    // `);
    //     $("#remote-playerlist").append(player);
        // user.videoTrack.play(`player-${uid}`);
        user.videoTrack.play(`player`);
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
}

function handleUserPublished(user, mediaType) {
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
}

function handleUserUnpublished(user) {
    const id = user.uid;
    delete remoteUsers[id];
    // $(`#player-wrapper-${id}`).remove();
}
  return (
    <div>
      <button
        onClick={() => {
          join();
        }}
      >
        join{' '}
      </button>
    </div>
  );
};
