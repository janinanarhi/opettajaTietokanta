//index.js
'use strict';

const http = require('http');
const path = require('path');
const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const Opettajakanta = require('./tietovarasto/opettajavarasto.js');

const kanta = new Opettajakanta({
    host: 'localhost',
    port: 3306,
    user: 'janina',
    password: 'P030609n',
    database: 'opettajatietokanta'
});


const kotipolku = path.join(__dirname, 'kotisivu.html');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'sivumallit'));

app.use(express.static(path.join(__dirname, 'resurssit')));

const palvelin = http.createServer(app);

app.get('/', (req, res) => res.sendFile(kotipolku));

app.get('/opettajat', async (req, res) => {
    try {
        const hakutulos = await kanta.haeKaikki();
        console.log('HAKUTULOS', hakutulos)
        res.render('tulostaulukolla', { hakutulos });
    } catch (virhe) {
        console.log('ERRORI!!', virhe)
        res.render('virhe', { viesti: virhe });
    }
});

app.get('/haeOpettaja', async (req, res) => {
    try {
        res.render('haeOpettaja');
    } catch (virhe) {
        console.log('ERRORI!!', virhe)
        res.render('virhe', { viesti: virhe });
    }
});

app.post('/haeOpettaja', express.urlencoded({ extended: false }), async (req, res) => {
    console.log('Hae opettaja', req.body)
    try {
        let hakutulos = await kanta.hae(req.body.opettajaID);
        hakutulos = [hakutulos]
        console.log('HAKUTULOS', hakutulos)
        res.render('tulostaulukolla', { hakutulos });
    } catch (virhe) {
        console.log('ERRORI!!', virhe)
        res.render('virhe', { viesti: virhe });
    }
});

app.get('/lisaaOpettaja', async (req, res) => {
    try {
        res.render('lisaaOpettaja');
    } catch (virhe) {
        console.log('ERRORI!!', virhe)
        res.render('virhe', { viesti: virhe });
    }
});


app.post('/lisaaOpettaja', express.urlencoded({ extended: false }), async (req, res) => {
    console.log('Lisää opettaja', req.body)
    try {
        let hakutulos = await kanta.lisaa({
            opettajaID: req.body.opettajaID,
            sukunimi: req.body.sukunimi,
            etunimi: req.body.etunimi,
            soitin: req.body.soitin,
            soitinryhmä: req.body.soitinryhmä,
            toimenkuva: req.body.toimenkuva,
            aloitusvuosi: req.body.aloitusvuosi,
        });
        console.log('HAKUTULOS', hakutulos)
        res.render('viesti', { viesti: hakutulos.viesti });
    } catch (virhe) {
        console.log('ERRORI!!', virhe)
        res.render('virhe', { viesti: virhe });
    }
});

app.get('/muokkaa', async (req, res) => {
    try {
        res.render('haeMuokattavaOpettaja');
    } catch (virhe) {
        console.log('ERRORI!!', virhe)
        res.render('virhe', { viesti: virhe });
    }
});

app.post('/haeMuokattavaOpettaja', express.urlencoded({ extended: false }), async (req, res) => {
    console.log('Hae muokattava opettaja', req.body)
    try {
        let hakutulos = await kanta.hae(req.body.opettajaID);
        //hakutulos = [hakutulos]
        console.log('HAKUTULOS', hakutulos)
        //console.log('ALOITUSVUOSI', hakutulos.aloitusvuosi.toLocaleDateString('fi', 'FI').split('T')[0])
        res.render('muokkaaOpettaja', { hakutulos });
    } catch (virhe) {
        console.log('ERRORI!!', virhe)
        res.render('virhe', { viesti: virhe });
    }
});

app.post('/muokkaaOpettaja', express.urlencoded({ extended: false }), async (req, res) => {
    console.log('Muokkaa opettaja', req.body)
    try {
        let hakutulos = await kanta.muokkaa(req.body.opettajaID, {
            opettajaID: req.body.opettajaID,
            sukunimi: req.body.sukunimi,
            etunimi: req.body.etunimi,
            soitin: req.body.soitin,
            soitinryhmä: req.body.soitinryhmä,
            toimenkuva: req.body.toimenkuva,
            aloitusvuosi: req.body.aloitusvuosi,
        });
        console.log('HAKUTULOS', hakutulos)
        res.render('viesti', { viesti: hakutulos.viesti });
    } catch (virhe) {
        console.log('ERRORI!!', virhe)
        res.render('virhe', { viesti: virhe });
    }
});

app.get('/poista', async (req, res) => {
    try {
        res.render('haePoistettavaOpettaja');
    } catch (virhe) {
        console.log('ERRORI!!', virhe)
        res.render('virhe', { viesti: virhe });
    }
});

app.post('/poistaOpettaja', express.urlencoded({ extended: false }), async (req, res) => {
    console.log('poista opettaja', req.body)
    try {
        let hakutulos = await kanta.poista(req.body.opettajaID);
        //hakutulos = [hakutulos]
        console.log('HAKUTULOS', hakutulos)
        res.render('viesti', { viesti: hakutulos.viesti });
    } catch (virhe) {
        console.log('ERRORI!!', virhe)
        res.render('virhe', { viesti: virhe });
    }
});



app.all('*', (req, res) =>
    res.status(404).render('virhe', { viesti: 'Resurssia ei löydy' }));

palvelin.listen(port, host, () => console.log(`Palvelin ${host} portissa ${port}`));
