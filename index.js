const Telegraf = require('telegraf')
const { Markup } = Telegraf

const app = new Telegraf('1064358977:AAFwLTIdDZRoez1xwcp7Gqkdv4yF3Z5OQKs')
const PAYMENT_TOKEN ='381764678:TEST:13646'

const products = [{
        name: 'Peperonni',
        price: 9.67,
        description: 'A lovely peperonni pizza from masters of Slaviansk',
        photoUrl:'http://pizzadiroma.ge/wp-content/uploads/2017/11/pepperonipeperoni.jpg'
    },
    {
        name: 'Hawaiska',
        price: 19.99,
        description: 'Esli ti lubish pizzu s ananasami to dlya tebya otdel`noe mesto v moem serdechke',
        photoUrl: 'https://sun9-30.userapi.com/c824201/v824201758/14d161/4IOnVGroe-4.jpg'
        

    },
    {
        name: 'Mozzarella',
        price: 14.99,
        description: 'Mozamozamozamoza moza moza moza',
        photoUrl: 'https://www.womenshealth.pl/media/lib/2725/pizza_528695131-cf404af1bb8220a28a5c39c672cad9f0.jpg'
    }
]

function createInvoice (product) {
    return {
        provider_token: PAYMENT_TOKEN,
        start_parameter: 'foo',
        title: product.name,
        description: product.description,
        currency: 'EUR',
        photo_url: product.photoUrl,
        is_flexible: false,
        need_shipping_address: false,
        prices: [{ label: product.name, amount: Math.trunc(product.price * 100) }],
        payload: {}
    }
}

app.command('start', ({ reply }) => reply('Hejka ya sprzedaje pizze.'))
app.hears(/^pizza.*/i, ({ replyWithMarkdown }) => replyWithMarkdown(`
Mam
${products.reduce((acc, p) => {
    return (acc += `*${p.name}* - ${p.price} EUR\n`)
    }, '')}    
Jaki jest wybor?`,
    Markup.keyboard(products.map(p => p.name)).oneTime().resize().extra()
))

products.forEach(p => {
    app.hears(p.name, (ctx) => {
        console.log(`${ctx.from.first_name} Chce kupic ${p.name}.`);
        ctx.replyWithInvoice(createInvoice(p))
    })
})

app.on('pre_checkout_query', ({ answerPreCheckoutQuery }) => answerPreCheckoutQuery(true))
app.on('successful_payment', (ctx) => {
    console.log(`${ctx.from.first_name} (${ctx.from.username}) zaplacil ${ctx.message.successful_payment.total_amount / 100} EUR.`)
})

app.startPolling()