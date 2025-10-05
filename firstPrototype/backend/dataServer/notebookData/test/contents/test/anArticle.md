++++
{
    "files": [],
    "createDate": "2025/10/6",
    "updateDate": "2025/10/6",
    "tags": ["linux" , "Command" , "Surge-XT" , "Drumstick-MIDI" , "issue"],
    "UUID": "f5423db7-948a-4509-8078-e1e8c175dd06"
}
++++

# Linux MIDI をとりあえず使えるようにする
## この記事を作った動機
　Linux 環境を使っていて、ソフトウェアシンセサイザー？とか、適当にネットでダウンロードしてきたMIDIファイルを再生するとかやってみている。  

　それで、Linux 環境における MIDI では、ちょっとすぐにはわからないようなことが必要だとわかったので、それをノートとして使っているこのブログに記録しようと思った。

## 使っているソフト
- Surge XT
`{{<figure src="/posts/linux/midi/SurgeXT.png" alt="SurgeXT" align="center">}}`

- Drumstick MIDI
`{{<figure src="/posts/linux/midi/drumstickMIDI.png" alt="DrumstickMIDI" align="center">}}`

## Midi を使う
　毎回起動時に特定のドライバを読み込まないと、midi が使えないようで、Drumstick MIDI は `MIDI setup` を開く段階でクラッシュした。
### やること
#### 有効化
```
sudo modprobe snd_virmidi
```
#### 無効化
```
sudo modprobe -r snd_virmidi
```
#### 起動時に自動で読み込まれるようにする
- /etc/systemd/system/midi.service
```
[Unit]
Description=load and unload virtual midi driver

[Service]
Type=simple
User=root
ExecStart=modprobe snd_virmidi
ExecStop=modprobe -r snd_virmidi
Restart=on-abort

[Install]
WantedBy=multi-user.target
```
- `midi.service`サービスの有効化
```
sudo systemctl enable midi
```

### ドライバを読み込む前の様子
　ちなみに以下のエラーや挙動は、ドライバを読み込んでから、ドライバを無効化したあとに試すと症状が再現しない。再起動後は、またドライバを読み込むまで症状が再現している。現時点で私は、この挙動については正直細かくはわかっていない。
#### エラーが出る例 (Drumstick MIDI)
`{{<figure src="/posts/linux/midi/ドライバを読み込む前のDrumstickMIDI.png" alt="ドライバを読み込む前のDrumstickMIDI" align="center">}}`
#### Active MIDI Inputs が何も出てこない例 (Surge XT)
`{{<figure src="/posts/linux/midi/ドライバを読み込む前のSurgeXT.png" alt="ドライバを読み込む前のSurgeXT" align="center">}}`

## MIDI の設定をする
　基本的には、`Midi Through` を使っておけば、ソフトウェア上では、音を鳴らせるところまで持っていける模様である。

### Surge XT
`{{<figure src="/posts/linux/midi/MIDIの設定を開く.png" alt="MIDIの設定を開く" align="center">}}`
`{{<figure src="/posts/linux/midi/SurgeXT側のMIDI設定.png" alt="SurgeXT側のMIDI設定" align="center">}}`

### Drumstick MIDI
`{{<figure src="/posts/linux/midi/MIDI setupを開く.png" alt="MIDI setupを開く" align="center">}}`
`{{<figure src="/posts/linux/midi/Drumstick-MIDIのMIDIを設定する.png" alt="Drumstick-MIDIのMIDIを設定する" align="center">}}`


## 参考にしたサイトとか
- Virtual MIDI keyboard input on Linux (ALSA or JACK, with Pipewire) : r/Bitwig   
https://www.reddit.com/r/Bitwig/comments/10uhclz/virtual_midi_keyboard_input_on_linux_alsa_or_jack/ (2025年9月24日) 
- MIDI - ArchWiki   
https://wiki.archlinux.org/title/MIDI (2025年9月24日) 

- Kernel Module Loading at Boot and modprobe Automation | Baeldung on Linux   
https://www.baeldung.com/linux/kernel-module-load-boot (2025年9月24日) 
- Linux: How to load a kernel module automatically at boot time - nixCraft   
https://www.cyberciti.biz/faq/linux-how-to-load-a-kernel-module-automatically-at-boot-time/ (2025年9月24日) 
- [Solved] - Files in /modprobe.d/ seem to be ignored / Newbie Corner / Arch Linux Forums   
https://bbs.archlinux.org/viewtopic.php?id=180265 (2025年9月24日) 
- Kernel Module Loading at Boot and modprobe Automation | Baeldung on Linux   
https://www.baeldung.com/linux/kernel-module-load-boot#2-commands (2025年9月24日) 