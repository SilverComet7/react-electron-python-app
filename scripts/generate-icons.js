const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 64, 128, 256];
const buildDir = path.join(__dirname, '../build');

// 确保 build 目录存在
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// 创建一个简单的图标
async function generateIcon() {
    // 创建一个基础的 SVG 图标
    const svgIcon = `
        <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
            <rect width="1024" height="1024" fill="#2196f3"/>
            <circle cx="512" cy="512" r="384" fill="#ffffff"/>
            <circle cx="512" cy="512" r="256" fill="#2196f3"/>
        </svg>
    `;

    // 为 Windows 创建 ICO 文件
    const icoPath = path.join(buildDir, 'icon.ico');
    const pngBuffers = await Promise.all(
        sizes.map(size =>
            sharp(Buffer.from(svgIcon))
                .resize(size, size)
                .png()
                .toBuffer()
        )
    );

    // 写入 PNG 文件作为临时图标
    await sharp(Buffer.from(svgIcon))
        .resize(256, 256)
        .png()
        .toFile(icoPath);

    // 为 Linux 创建 PNG
    await sharp(Buffer.from(svgIcon))
        .resize(512, 512)
        .png()
        .toFile(path.join(buildDir, 'icon.png'));

    console.log('Icons generated successfully!');
}

generateIcon().catch(console.error); 