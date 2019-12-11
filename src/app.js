const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const publicPath=path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../template/views')
const partialPath = path.join(__dirname, '../template/partials')

app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialPath)

app.use(express.static(publicPath))

app.get('',(req,res)=>{
    res.render('index',{
        title:'Weather',
        name:'Hiren Madhu'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About me',
        name:'Hiren Madhu'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title:'Help',
        helpText:'This is some helpful text xD',
        name:'Hiren Madhu'
    })
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error:' You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error:'You need to provide an address!'
        })
    }

    geocode(req.query.address,(error, {latitude, longitude, location}={}) => {
        if(error){
            return res.send({error})
        }
        forecast(latitude,longitude,(error, forecastData)=>{
            console.log(error)
            if(error){
                return res.send({error})
            }
            res.send({
                forecast:forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        error:'Help article not found',
        name:'Hiren Madhu'
    })
})

app.get('*',(req,res) => {
    res.render('404',{
        error:'My 404 page',
        name:'Hiren Madhu'
    })
})

app.listen(3000, ()=>{
    console.log('Listening to port 3000')
})