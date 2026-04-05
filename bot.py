import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# ── Sozlamalar ──────────────────────────────────────────────────────────────
TOKEN = os.environ.get("BOT_TOKEN", "")          # Railway da environment variable
WEBAPP_URL = os.environ.get("WEBAPP_URL", "")    # Vercel URL (https://lingua-xxx.vercel.app)

# ── /start ───────────────────────────────────────────────────────────────────
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    name = user.first_name or "O'quvchi"

    keyboard = [
        [InlineKeyboardButton(
            "🎓 Linguani ochish",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )],
        [
            InlineKeyboardButton("🎤 Speaking", callback_data="speaking"),
            InlineKeyboardButton("🎧 Listening", callback_data="listening"),
        ],
        [
            InlineKeyboardButton("📖 Reading", callback_data="reading"),
            InlineKeyboardButton("✍️ Writing", callback_data="writing"),
        ],
        [InlineKeyboardButton("📊 Darajamni bilish", callback_data="level")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        f"Salom, {name}! 👋\n\n"
        f"*Lingua* — English o'rganish platformasiga xush kelibsiz!\n\n"
        f"🎤 *Speaking* — AI bilan suhbat\n"
        f"🎧 *Listening* — Eshitib yozish\n"
        f"📖 *Reading* — Vocab & matn\n"
        f"✍️ *Writing* — IELTS essay\n\n"
        f"Bosing va boshlang! 🚀",
        parse_mode="Markdown",
        reply_markup=reply_markup
    )

# ── /help ────────────────────────────────────────────────────────────────────
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📚 *Lingua bot buyruqlari:*\n\n"
        "/start — Bosh sahifa\n"
        "/speaking — Speaking mashqi\n"
        "/listening — Listening mashqi\n"
        "/reading — Reading mashqi\n"
        "/writing — Writing mashqi\n"
        "/level — Darajamni ko'rish\n"
        "/help — Yordam\n\n"
        "Yoki pastdagi tugmalardan foydalaning! 👇",
        parse_mode="Markdown"
    )

# ── Skill buyruqlari ─────────────────────────────────────────────────────────
async def speaking(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton(
        "🎤 Speaking ochish",
        web_app=WebAppInfo(url=f"{WEBAPP_URL}?tab=speak")
    )]]
    await update.message.reply_text(
        "🎤 *Speaking Practice*\n\n"
        "AI conversation partner bilan inglizcha suhbatlashing.\n"
        "Mavzu tanlab, xato qilmasdan gapiring — AI muloyimlik bilan tuzatadi.\n\n"
        "_3 javobdan keyin feedback olasiz!_",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def listening(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton(
        "🎧 Listening ochish",
        web_app=WebAppInfo(url=f"{WEBAPP_URL}?tab=listen")
    )]]
    await update.message.reply_text(
        "🎧 *Listening Practice*\n\n"
        "Inglizcha gapni eshiting → yozing → tekshiring!\n"
        "3 ketma-ket to'g'ri → daraja oshadi 📈\n\n"
        "_A1 dan C1 gacha avtomatik o'sadi_",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def reading(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton(
        "📖 Reading ochish",
        web_app=WebAppInfo(url=f"{WEBAPP_URL}?tab=read")
    )]]
    await update.message.reply_text(
        "📖 *Reading Practice*\n\n"
        "• *Vocab Match* — so'z va ta'riflarni bog'lang\n"
        "• *Passage* — matn o'qing, savollarga javob bering\n\n"
        "_Daraja tanlang va boshlang!_",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def writing(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton(
        "✍️ Writing ochish",
        web_app=WebAppInfo(url=f"{WEBAPP_URL}?tab=write")
    )]]
    await update.message.reply_text(
        "✍️ *IELTS Writing*\n\n"
        "• *Task 1* — Grafik/jadval tavsifi\n"
        "• *Task 2* — Essay yozish\n\n"
        "Yozgach AI band score va feedback beradi 📊",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def level_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [
            InlineKeyboardButton("A1 — Beginner", callback_data="set_level_A1"),
            InlineKeyboardButton("A2 — Elementary", callback_data="set_level_A2"),
        ],
        [
            InlineKeyboardButton("B1 — Intermediate", callback_data="set_level_B1"),
            InlineKeyboardButton("B2 — Upper-Int", callback_data="set_level_B2"),
        ],
        [InlineKeyboardButton("C1 — Advanced", callback_data="set_level_C1")],
    ]
    await update.message.reply_text(
        "📊 *Darajangizni tanlang:*\n\n"
        "A1 → A2 → B1 → B2 → C1\n\n"
        "_Tanlagan darajadan mashqlar boshlanadi_",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

# ── Callback (inline tugmalar) ────────────────────────────────────────────────
async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data

    if data.startswith("set_level_"):
        level = data.replace("set_level_", "")
        context.user_data["level"] = level
        descriptions = {
            "A1": "Beginner — eng asosiy so'zlar va gaplar",
            "A2": "Elementary — oddiy suhbatlar",
            "B1": "Intermediate — ko'pchilik mavzularda gaplasha olasiz",
            "B2": "Upper-Intermediate — murakkab mavzular",
            "C1": "Advanced — deyarli professional daraja",
        }
        keyboard = [[InlineKeyboardButton(
            "🎓 Boshlash",
            web_app=WebAppInfo(url=f"{WEBAPP_URL}?level={level}")
        )]]
        await query.edit_message_text(
            f"✅ Daraja: *{level}* — {descriptions.get(level, '')}\n\n"
            f"Ilovada ham {level} ni tanlashni unutmang! 👆",
            parse_mode="Markdown",
            reply_markup=InlineKeyboardMarkup(keyboard)
        )

    elif data == "level":
        await level_command(query, context)

    elif data in ["speaking", "listening", "reading", "writing"]:
        tab_map = {"speaking": "speak", "listening": "listen", "reading": "read", "writing": "write"}
        keyboard = [[InlineKeyboardButton(
            f"Ochish →",
            web_app=WebAppInfo(url=f"{WEBAPP_URL}?tab={tab_map[data]}")
        )]]
        await query.edit_message_reply_markup(reply_markup=InlineKeyboardMarkup(keyboard))

# ── Har qanday matn ───────────────────────────────────────────────────────────
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text.lower().strip()
    if any(w in text for w in ["salom", "hello", "hi", "hey"]):
        await start(update, context)
    elif any(w in text for w in ["speaking", "gapiruv", "speak"]):
        await speaking(update, context)
    elif any(w in text for w in ["listening", "eshit"]):
        await listening(update, context)
    elif any(w in text for w in ["reading", "o'qish", "read"]):
        await reading(update, context)
    elif any(w in text for w in ["writing", "yozish", "write"]):
        await writing(update, context)
    else:
        keyboard = [[InlineKeyboardButton("🎓 Ilovani ochish", web_app=WebAppInfo(url=WEBAPP_URL))]]
        await update.message.reply_text(
            "🤖 Buyruqlarni ishlating:\n/speaking /listening /reading /writing\n\nYoki ilovani oching:",
            reply_markup=InlineKeyboardMarkup(keyboard)
        )

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    if not TOKEN:
        raise ValueError("BOT_TOKEN environment variable yo'q!")
    if not WEBAPP_URL:
        raise ValueError("WEBAPP_URL environment variable yo'q!")

    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("speaking", speaking))
    app.add_handler(CommandHandler("listening", listening))
    app.add_handler(CommandHandler("reading", reading))
    app.add_handler(CommandHandler("writing", writing))
    app.add_handler(CommandHandler("level", level_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    from telegram.ext import CallbackQueryHandler
    app.add_handler(CallbackQueryHandler(button_handler))

    logger.info("Bot ishga tushdi! ✅")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
