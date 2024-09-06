const puppeteer = require('puppeteer')
const userSchema = require('../dataModel/user')
const clubSchema = require('../dataModel/club')
const tripSchema = require('../dataModel/trip')
const chatSchema = require('../dataModel/chat')

const scrapeData = async (req, res) => {
    try {
        const { place } = req.query
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const url = `https://www.fundayholidays.com/destinations/india/${place}`;
        await page.goto(url);

        const trips = await page.evaluate(() => {
            const attractionEment = document.querySelectorAll('.card-floated')
            return Array.from(attractionEment).map((trip) => {
                const title = trip.querySelector('h3.card-title')
                const imgElement = trip.querySelector('img')
                return {
                    title: title ? title.textContent.trim() : null,
                    img: imgElement ? imgElement.src : null
                }
            }).filter(item => item.title || item.img)
        })
        res.json({ status: 200, data: trips })
        await browser.close();
    } catch (error) {
        console.error('Error scraping the page:', error);
        console.error('Error details:', error.message);
    }
}
const login = async (req, res) => {
    try {
        const { name, email, picture } = req.body
        const findUser = await userSchema.find({ email: email })
        if (findUser.length === 0) {
            await userSchema.create({ name, email, picture })
            res.status(200).json({ message: 'user registered and logined' })
        } else {
            res.status(200).json({ message: 'logined' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}
const craeteClub = async (req, res) => {
    try {
        const { clubName, admin, logo, place, longitude, latitude } = req.body
        location = { place, longitude, latitude }
        const today = new Date()
        const create = await clubSchema.create({ clubName, admin, logo, cratedAt: today, location })
        res.status(200).json({ message: 'Club Created Successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}

const getClubs = async (req, res) => {
    console.log('get club');

    try {
        const clubs = await clubSchema.find()
        console.log(clubs, 'lllll');

        res.status(200).json({ message: '', data: clubs })
    } catch (error) {
        console.error(error)
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}

const joinClub = async (req, res) => {
    try {
        const { email, id } = req.body

        const user = await userSchema.findOne({ email: email })
        const club = await clubSchema.findById(id);

        if (user) {
            const isMember = club.members.some(member => member.member.equals(user._id));
            if (!isMember) {
                club.members.push({ email: user.email, member: user._id });
                await club.save();
            } else {
                club.members = club.members.filter(member => !member.member.equals(user._id));
                await club.save();
            }
            res.status(200).json({ message: isMember ? 'User Romeved club successfully' : 'User added to club successfully' });
        } else {
            return res.status(400).json({ message: 'User is already a member of this club or user not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) });
    }
}
const getClubDetail = async (req, res) => {
    try {
        const { id } = req.query
        const club = await clubSchema.findOne({ _id: id }).populate({
            path: 'members.member',
            select: 'name picture email'
        });
        const trips = await tripSchema.find({ club: id })
        res.status(200).json({ message: '', data: club, trip: trips })
    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}

const createTrip = async (req, res) => {
    try {
        const { title, date, itenaries, id } = req.body
        const response = await tripSchema.create({ club: id, title, startDate: date, itenary: itenaries })
        console.log(response);
        res.status(200).json({ message: 'created', })
    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}
const getTrips = async (req, res) => {
    try {
        const trips = await tripSchema.find()
        res.status(200).json({ message: 'created', data: trips })

    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}

const getTripDetail = async (req, res) => {
    try {
        const { id } = req.query
        const tripData = await tripSchema.findById(id).populate({
            path: 'members.member',
            select: 'name picture email'
        }).populate({
            path:'club',
            select:'clubName logo'
        })
        if (tripData) {
            res.status(200).json({ message: 'success', data: tripData })
        } else {
            return res.status(400).json({ message: 'trip not found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}

const joinTrip = async (req, res) => {
    try {
        const { email, id } = req.body
        console.log('reqq', email, id);

        const user = await userSchema.findOne({ email: email })
        const trip = await tripSchema.findById(id)


        const isMember = trip.members.some(member => member.member.equals(user._id))
        console.log(user.email, trip.title, isMember, '74');
        if (user) {
            if (!isMember) {
                trip.members.push({ email: user.email, member: user._id })
                await trip.save()
            } else {
                trip.members = trip.members.filter(member => !member.member.equals(user._id));
                await trip.save();
            }
            const tripData = await tripSchema.findById(id).populate({
                path: 'members.member',
                select: 'name picture'
            });
            res.status(200).json({ message: 'success', action: isMember ? 'exit' : 'join', data: tripData })
        } else {
            return res.status(400).json({ message: 'User is already a member of this Trip or user not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}
const exitTrip = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}
const newChat = async (req, res) => {
    try {
        console.log('hiii');

        const { club, messageData } = req.body
        const chatData = await chatSchema.findOne({ club: club })
        console.log('clubData', chatData);

        if (chatData !== null) {
            console.log('exist')
            await chatSchema.updateOne({ club: club }, { $push: { messages: messageData } })
        } else {
            console.log('new');

            await chatSchema.create({ club: club, messages: [messageData] })
        }
        const updatedChat = await chatSchema.find({ club: club })
        res.status(200).json({ message: 'success', data: updatedChat })

    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}

const getChat = async (req, res) => {
    try {
        const { club } = req.query
        console.log('clubbb', club);
        const clubdata = await clubSchema.findById(club).select('logo clubName');       
        const updatedChat = await chatSchema.find({ club: club })
        console.log(updatedChat, 'chat');

        res.status(200).json({ message: 'success', data: updatedChat,clubdata })
    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: ("Server Error", error) })
    }
}
module.exports = {
    scrapeData,

    craeteClub,
    getClubs,
    joinClub,
    getClubDetail,

    createTrip,
    getTrips,
    getTripDetail,
    joinTrip,
    exitTrip,

    login,
    newChat,
    getChat,
}