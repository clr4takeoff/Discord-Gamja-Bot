// 1. 주요 클래스 가져오기
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, channelId } = require('./config.json'); // config.json에서 token과 channelId 가져옴
const cron = require('node-cron'); // node-cron 패키지 사용

// 2. 클라이언트 객체 생성 (Guilds 관련, 메시지 관련 인텐트 추가)
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,  // ✅ 메시지 감지 기능 활성화
    GatewayIntentBits.DirectMessages   // ✅ DM에서도 작동할 수 있도록 추가
]});

// 3. 봇이 준비됐을 때 실행될 이벤트
client.once(Events.ClientReady, async readyClient => {
    console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);

    // 4. 매일 오전 9시에 특정 채널에 메시지 보내기
    cron.schedule('0 9 * * *', async () => {
        try {
            const channel = await client.channels.fetch(channelId); // ✅ fetch() 사용하여 채널 가져오기
            if (channel) {
                await channel.send("🔥 뜨거운 감자 프로젝트가 진행되고 있어요!");
                console.log("✅ 자동 메시지 전송 완료!");
            } else {
                console.error("❌ 채널을 찾을 수 없습니다. config.json에서 channelId를 확인하세요.");
            }
        } catch (error) {
            console.error("❌ 자동 메시지 전송 중 오류 발생:", error);
        }
    }, {
        timezone: "Asia/Seoul" // ✅ 한국 시간 기준 설정
    });

    console.log("⏰ 자동 메시지 스케줄러 설정 완료!");
});

// 5. 특정 메시지에 반응
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // ✅ 봇이 보낸 메시지는 무시

    const content = message.content.trim(); // ✅ 공백 제거 후 비교

    // "감" 입력 시 "자"로 응답
    if (content === '감') {
        await message.reply('자');
    }

    // "test" 입력 시 "감자가 불타오르고 있어요!"로 응답
    if (content.toLowerCase() === 'test') {
        await message.reply('감자가 불타오르고 있어요! 🔥🥔');
    }
});

// 6. 시크릿키(토큰)을 통해 봇 로그인 실행
client.login(token);
