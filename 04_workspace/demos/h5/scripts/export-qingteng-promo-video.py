#!/usr/bin/env python3
from __future__ import annotations

import math
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH = 1080
HEIGHT = 1920
FPS = 5
TOTAL_SECONDS = 70
FFMPEG = "/Applications/Downie 4.app/Contents/Resources/ffmpeg"
OUT = Path(__file__).resolve().parents[1] / "public/qingteng-video-assets/qingteng-doctor-promo-vertical.mp4"
FONT_PATH = "/System/Library/Fonts/PingFang.ttc"


SCENES = [
    {
        "id": "value-loop",
        "index": "01",
        "start": 0,
        "end": 6,
        "title": "青藤医生平台",
        "subtitle": "让检查服务形成闭环",
        "caption": ["青藤平台打通患者预约", "到院检查与报告回传", "帮助医生形成闭环"],
        "keywords": ["患者预约", "报告回传", "医生解读", "患者管理"],
    },
    {
        "id": "onboarding",
        "index": "02",
        "start": 6,
        "end": 14,
        "title": "01 医生如何入驻平台",
        "subtitle": "三步完成开通",
        "caption": ["医生入驻流程很简单", "运营协助提交信息", "审核通过开通服务"],
        "keywords": ["劳务协议", "运营协助", "平台审核"],
    },
    {
        "id": "service-mode",
        "index": "03",
        "start": 14,
        "end": 20,
        "title": "02 选择适合的患者服务方式",
        "subtitle": "运营协助，平台赋能",
        "caption": ["结合医生自身场景", "选择患者服务方式", "平台提供流程支持"],
        "keywords": ["运营协助", "平台赋能", "物料支持"],
    },
    {
        "id": "patient-booking",
        "index": "04",
        "start": 20,
        "end": 40,
        "title": "03 患者如何完成检查预约",
        "subtitle": "小程序自助预约流程",
        "caption": ["患者扫码进入小程序", "选择项目与预约时间", "就近机构完成支付", "报告回传提醒查看"],
        "keywords": ["患者预约", "检查机构", "报告回传", "短信提醒"],
    },
    {
        "id": "doctor-report",
        "index": "05",
        "start": 40,
        "end": 48,
        "title": "04 医生如何完成报告解读任务",
        "subtitle": "任务分配与 AI 辅助确认",
        "caption": ["平台分配待解读任务", "进入任务详情查看", "结合 AI 辅助确认"],
        "keywords": ["待解读任务", "AI 辅助确认", "完成解读"],
    },
    {
        "id": "withdraw",
        "index": "06",
        "start": 48,
        "end": 55,
        "title": "05 劳务费明细与提现",
        "subtitle": "规范明细，审核打款",
        "caption": ["生成规范劳务费明细", "医生发起提现申请", "平台审核后完成打款"],
        "keywords": ["规范劳务费", "提现申请", "平台审核"],
    },
    {
        "id": "future",
        "index": "07",
        "start": 55,
        "end": 65,
        "title": "06 沉淀患者资源，打造院后管理能力",
        "subtitle": "个人 IP、数字分身与持续服务",
        "caption": ["帮助医生沉淀患者资源", "打造个人 IP 与数字分身", "形成院后管理能力"],
        "keywords": ["数字分身", "院后管理", "持续服务价值"],
    },
    {
        "id": "ending",
        "index": "08",
        "start": 65,
        "end": 70,
        "title": "青藤医生平台",
        "subtitle": "让医生服务更规范，让患者管理更持续",
        "caption": ["让医生服务更规范", "让患者管理更持续"],
        "keywords": ["规范服务", "持续管理"],
    },
]


def font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size)


F = {
    "brand": font(28),
    "index": font(30),
    "title": font(78),
    "subtitle": font(34),
    "label": font(30),
    "small": font(24),
    "caption": font(46),
    "card_title": font(40),
    "card_small": font(25),
}


def lerp(a: int, b: int, p: float) -> int:
    return int(a + (b - a) * p)


def ease(p: float) -> float:
    p = max(0.0, min(1.0, p))
    return 1 - (1 - p) ** 3


def scene_at(t: float):
    for scene in SCENES:
        if scene["start"] <= t < scene["end"]:
            progress = (t - scene["start"]) / (scene["end"] - scene["start"])
            return scene, progress
    return SCENES[-1], 1.0


def text_size(draw: ImageDraw.ImageDraw, text: str, ft: ImageFont.FreeTypeFont):
    box = draw.textbbox((0, 0), text, font=ft)
    return box[2] - box[0], box[3] - box[1]


def wrap(draw: ImageDraw.ImageDraw, text: str, ft: ImageFont.FreeTypeFont, max_width: int):
    lines: list[str] = []
    current = ""
    for char in text:
        trial = current + char
        if text_size(draw, trial, ft)[0] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = char
    if current:
        lines.append(current)
    return lines


def draw_text_block(draw, xy, text, ft, fill, max_width, line_gap=14):
    x, y = xy
    for line in wrap(draw, text, ft, max_width):
        draw.text((x, y), line, font=ft, fill=fill)
        y += text_size(draw, line, ft)[1] + line_gap
    return y


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def gradient_bg():
    img = Image.new("RGB", (WIDTH, HEIGHT), "#f7fffc")
    px = img.load()
    for y in range(HEIGHT):
        for x in range(WIDTH):
            p = (x / WIDTH * 0.35) + (y / HEIGHT * 0.65)
            r = lerp(246, 232, p)
            g = lerp(255, 247, p)
            b = lerp(252, 255, p)
            if x < WIDTH * 0.42 and y < HEIGHT * 0.78:
                g = min(255, g + 6)
                b = max(0, b - 4)
            px[x, y] = (r, g, b)
    return img


BASE_BG = gradient_bg()


def draw_header(draw, scene, progress):
    rounded(draw, (82, 70, 150, 138), 18, "#0f9678")
    draw.text((106, 88), "青", font=F["brand"], fill="white")
    draw.text((178, 92), "青藤医生平台", font=F["brand"], fill="#235c52")
    draw.text((840, 94), scene["index"], font=F["index"], fill="#07886e")
    draw.rounded_rectangle((895, 112, 995, 120), radius=4, fill="#c9ece3")
    draw.rounded_rectangle((895, 112, 895 + int(100 * progress), 120), radius=4, fill="#099173")


def draw_title(draw, scene):
    draw.text((82, 250), scene["index"], font=F["index"], fill="#07886e")
    draw_text_block(draw, (82, 314), scene["title"], F["title"], "#103730", 860, 12)
    draw.text((82, 514), scene["subtitle"], font=F["subtitle"], fill="#5a766e")


def draw_keywords(draw, scene):
    x = 90
    y = 1658
    for kw in scene["keywords"]:
        w = text_size(draw, kw, F["small"])[0] + 42
        rounded(draw, (x, y, x + w, y + 54), 27, "#ffffff", "#bfe8df", 2)
        draw.text((x + 21, y + 13), kw, font=F["small"], fill="#087e66")
        x += w + 18
        if x > 900:
            x = 90
            y += 66


def draw_caption(draw, scene, progress):
    captions = scene["caption"]
    idx = min(int(progress * len(captions)), len(captions) - 1)
    rounded(draw, (86, 1772, 994, 1858), 18, "#244f47")
    text = captions[idx]
    w = text_size(draw, text, F["caption"])[0]
    draw.text(((WIDTH - w) / 2, 1790), text, font=F["caption"], fill="white")


def draw_scene_base(draw, scene, progress):
    draw_header(draw, scene, progress)
    draw_title(draw, scene)
    draw_keywords(draw, scene)
    draw_caption(draw, scene, progress)


def draw_flow(draw, progress):
    cx, cy = 540, 1030
    draw.ellipse((315, 805, 765, 1255), outline="#b7e5dc", width=5)
    draw.ellipse((385, 875, 695, 1185), fill="#14a98b")
    draw_text_block(draw, (452, 948), "患者检查服务闭环", font(47), "white", 210, 8)
    nodes = [("患者预约支付", -90), ("到院检查", -18), ("报告回传", 54), ("医生解读", 126), ("患者管理", 198)]
    for i, (label, deg) in enumerate(nodes):
        lit = progress > i * 0.16
        rad = math.radians(deg)
        x = cx + math.cos(rad) * 310
        y = cy + math.sin(rad) * 310
        fill = "#ffffff" if lit else "#eff8f5"
        outline = "#7fd4c2" if lit else "#d5eee8"
        rounded(draw, (x - 118, y - 56, x + 118, y + 56), 16, fill, outline, 3)
        tw = text_size(draw, label, F["small"])[0]
        draw.text((x - tw / 2, y - 15), label, font=F["small"], fill="#246055" if lit else "#95aaa3")


def draw_onboarding(draw, progress):
    steps = [("签署劳务协议", "规范合作基础"), ("运营扫码提交信息", "协助完成资料"), ("审核通过开通服务", "进入医生端")]
    for i, (title, meta) in enumerate(steps):
        y = 740 + i * 210
        lit = progress > i * 0.25
        xoff = int((1 - ease(progress - i * 0.18)) * 50) if not lit else 0
        rounded(draw, (90 + xoff, y, 990 + xoff, y + 154), 22, "#ffffff", "#bde8df", 2)
        draw.text((130 + xoff, y + 44), f"0{i+1}", font=F["card_title"], fill="#079073")
        draw.text((250 + xoff, y + 34), title, font=F["card_title"], fill="#123b33")
        draw.text((250 + xoff, y + 92), meta, font=F["small"], fill="#6a8179")


def draw_service_mode(draw, progress):
    rounded(draw, (90, 770, 410, 1030), 24, "#ffffff", "#c0e7df", 2)
    rounded(draw, (670, 770, 990, 1030), 24, "#ffffff", "#c0e7df", 2)
    draw.text((196, 845), "医生", font=F["card_title"], fill="#123b33")
    draw.text((776, 845), "运营", font=F["card_title"], fill="#123b33")
    draw.rounded_rectangle((430, 895, 650, 906), 5, fill="#bfe7df")
    draw.rounded_rectangle((430, 895, 430 + int(220 * progress), 906), 5, fill="#0c9375")
    labels = ["运营协助", "平台赋能", "流程支持", "物料引导"]
    for i, label in enumerate(labels):
        x = 120 + (i % 2) * 440
        y = 1130 + (i // 2) * 118
        fill = "#0c9375" if progress > i * 0.2 else "#ffffff"
        color = "white" if progress > i * 0.2 else "#58746c"
        rounded(draw, (x, y, x + 360, y + 82), 18, fill, "#c5e9e1", 2)
        draw.text((x + 95, y + 22), label, font=F["label"], fill=color)


def draw_phone(draw, x, y, title):
    rounded(draw, (x, y, x + 420, y + 820), 58, "#102c27")
    draw.rounded_rectangle((x + 150, y + 28, x + 270, y + 38), 5, fill="#58716a")
    rounded(draw, (x + 26, y + 58, x + 394, y + 790), 44, "#f8fffc")
    draw.text((x + 54, y + 90), title, font=F["small"], fill="#143d35")


def draw_patient_booking(draw, progress):
    draw_phone(draw, 92, 680, "一脉青藤")
    steps = ["扫码进入", "自助检查", "选择项目", "填写主诉", "预约时间", "就近机构", "就诊信息", "支付成功", "到院检查", "报告提醒"]
    active = min(int(progress * len(steps)), len(steps) - 1)
    rounded(draw, (140, 840, 464, 1090), 22, "#19ac91")
    label = steps[active]
    tw = text_size(draw, label, F["card_title"])[0]
    draw.text((302 - tw / 2, 930), label, font=F["card_title"], fill="white")
    rounded(draw, (140, 1140, 464, 1205), 12, "#eaf8f3")
    draw.text((164, 1158), "胸部 CT 平扫", font=F["small"], fill="#21483f")
    rounded(draw, (140, 1230, 464, 1295), 12, "#eaf8f3")
    draw.text((164, 1248), "就近交付中心", font=F["small"], fill="#21483f")
    for i, step in enumerate(steps):
        x = 560 + (i % 2) * 226
        y = 720 + (i // 2) * 118
        lit = i <= active
        rounded(draw, (x, y, x + 196, y + 80), 14, "#0c9375" if lit else "#eff8f5")
        draw.text((x + 24, y + 24), f"{i+1}. {step}", font=F["small"], fill="white" if lit else "#8fa6a0")


def draw_doctor_report(draw, progress):
    draw_phone(draw, 110, 690, "医生端")
    states = ["待解读任务", "查看详情", "AI 辅助确认", "完成解读"]
    active = min(int(progress * 4), 3)
    rounded(draw, (160, 880, 480, 1160), 22, "#ffffff")
    rounded(draw, (190, 915, 350, 960), 22, "#e8f8f3")
    draw.text((207, 926), "AI 辅助确认", font=F["small"], fill="#087e66")
    draw.text((190, 995), "报告解读服务", font=F["card_title"], fill="#153c34")
    draw.text((190, 1065), "模拟患者 A · 报告已回传", font=F["small"], fill="#617970")
    for i, state in enumerate(states):
        y = 805 + i * 130
        lit = i <= active
        rounded(draw, (620, y, 975, y + 90), 16, "#0c9375" if lit else "#ffffff", "#c5e9e1", 2)
        draw.text((655, y + 26), state, font=F["label"], fill="white" if lit else "#57746b")


def draw_withdraw(draw, progress):
    rounded(draw, (104, 720, 976, 980), 28, "#ffffff", "#c1e7df", 2)
    draw.text((150, 765), "规范劳务费明细", font=F["label"], fill="#57736b")
    draw.text((150, 835), "¥128.00", font=font(92), fill="#0b8d73")
    draw.text((150, 930), "模拟数据 · 已完成 2 项报告解读服务", font=F["small"], fill="#70877f")
    steps = ["完成报告解读", "生成劳务费明细", "发起提现", "平台审核", "完成打款"]
    active = min(int(progress * len(steps)), len(steps) - 1)
    for i, step in enumerate(steps):
        y = 1060 + i * 104
        lit = i <= active
        rounded(draw, (110, y, 970, y + 74), 16, "#0c9375" if lit else "#ffffff", "#c5e9e1", 2)
        draw.text((158, y + 20), step, font=F["label"], fill="white" if lit else "#58746c")


def draw_future(draw, progress):
    items = ["医生个人 IP", "患者资源沉淀", "AI 数字分身", "院后管理", "复查提醒", "长期服务"]
    positions = [(90, 720), (650, 720), (90, 980), (650, 980), (160, 1240), (580, 1240)]
    for i, (item, (x, y)) in enumerate(zip(items, positions)):
        lit = progress > i * 0.13
        rounded(draw, (x, y, x + 340, y + 130), 20, "#ffffff" if lit else "#eff8f5", "#c0e7df", 2)
        tw = text_size(draw, item, F["label"])[0]
        draw.text((x + 170 - tw / 2, y + 45), item, font=F["label"], fill="#235b51" if lit else "#8fa6a0")
    draw.ellipse((350, 930, 730, 1310), fill="#16aa8c")
    draw_text_block(draw, (440, 1045), "持续服务价值", font(52), "white", 220, 8)


def draw_ending(draw):
    rounded(draw, (310, 620, 770, 1080), 82, "#0d9578")
    draw_text_block(draw, (388, 760), "青藤医生平台", font(62), "white", 310, 10)
    rounded(draw, (130, 1190, 400, 1260), 35, "#ffffff", "#c2e8df", 2)
    rounded(draw, (680, 1190, 950, 1260), 35, "#ffffff", "#c2e8df", 2)
    draw.text((215, 1210), "医生端", font=F["label"], fill="#235b51")
    draw.text((765, 1210), "患者端", font=F["label"], fill="#235b51")
    draw.rounded_rectangle((430, 1223, 650, 1230), 4, fill="#0d9578")
    draw.text((198, 1370), "让医生服务更规范", font=font(62), fill="#12372f")
    draw.text((225, 1460), "让患者管理更持续", font=font(54), fill="#0b8d73")


def render_frame(t: float) -> Image.Image:
    scene, progress = scene_at(t)
    img = BASE_BG.copy()
    draw = ImageDraw.Draw(img)
    draw_scene_base(draw, scene, progress)
    sid = scene["id"]
    if sid == "value-loop":
        draw_flow(draw, progress)
    elif sid == "onboarding":
        draw_onboarding(draw, progress)
    elif sid == "service-mode":
        draw_service_mode(draw, progress)
    elif sid == "patient-booking":
        draw_patient_booking(draw, progress)
    elif sid == "doctor-report":
        draw_doctor_report(draw, progress)
    elif sid == "withdraw":
        draw_withdraw(draw, progress)
    elif sid == "future":
        draw_future(draw, progress)
    else:
        draw_ending(draw)
    return img


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        FFMPEG,
        "-y",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{WIDTH}x{HEIGHT}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-c:v",
        "h264_videotoolbox",
        "-b:v",
        "6000k",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(OUT),
    ]
    try:
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    except FileNotFoundError:
        print(f"ffmpeg not found: {FFMPEG}", file=sys.stderr)
        return 1
    assert proc.stdin is not None
    total_frames = TOTAL_SECONDS * FPS
    for frame in range(total_frames):
        t = frame / FPS
        img = render_frame(t)
        proc.stdin.write(img.tobytes())
        if frame % FPS == 0:
            print(f"render {frame // FPS:02d}s/{TOTAL_SECONDS}s", flush=True)
    proc.stdin.close()
    return proc.wait()


if __name__ == "__main__":
    raise SystemExit(main())
