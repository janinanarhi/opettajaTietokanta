'use strict';

const Tietokanta = require('./tietokanta.js');

const ohjelmavirhe = virhe => {
    if (virhe) console.log(virhe);
    return new Error('Ohjelmavirhe');
}

const virhe = virhe => {
    if (virhe) console.log(virhe);
    return new Error(virhe);
}

const opettajantiedot = opettaja => [+opettaja.opettajaID, opettaja.sukunimi, opettaja.etunimi, opettaja.soitin, opettaja.soitinryhmä, opettaja.toimenkuva, opettaja.aloitusvuosi];
const paivitysTiedot = opettaja => [opettaja.sukunimi, opettaja.etunimi, opettaja.soitin, opettaja.soitinryhmä, opettaja.toimenkuva, opettaja.aloitusvuosi, +opettaja.opettajaID]

const paivaysSuomenAikaan = (aloitusvuosi) => {
    const osat = aloitusvuosi.toLocaleDateString('fi-FI').split('T')[0].split('-')
    let kuukausi = osat[1]
    if (kuukausi < 10) {
        kuukausi = '0' + kuukausi
    }
    let paiva = osat[2]
    if (paiva < 10) {
        paiva = '0' + paiva
    }
    return osat[0] + '-' + kuukausi + '-' + paiva
}

//sql-lauseet
const haeKaikkiSql = 'SELECT opettajaID, sukunimi, etunimi, soitin, soitinryhmä, toimenkuva, aloitusvuosi from opettaja';
const haeOpettajaSql = 'SELECT opettajaID, sukunimi, etunimi, soitin, soitinryhmä, toimenkuva, aloitusvuosi from opettaja where opettajaID=?';
const lisaaOpettajaSql = 'INSERT INTO opettaja(opettajaID, sukunimi, etunimi, soitin, soitinryhmä, toimenkuva, aloitusvuosi) values(?,?,?,?,?,?,?)';
const paivitaOpettajaSql = 'UPDATE opettaja SET sukunimi = ?, etunimi = ?, soitin = ?, soitinryhmä  = ?, toimenkuva  = ?, aloitusvuosi  = ? WHERE opettajaID = ?';
const poistaOpettajaSql = 'DELETE FROM opettaja where opettajaID=?';

module.exports = class Opettajakanta {

    constructor(optiot) {
        this.varasto = new Tietokanta(optiot);
    }



    haeKaikki() {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.varasto.suoritaKysely(haeKaikkiSql);
                if (tulos.tulosjoukko) {
                    const kaikkiOpettajat = tulos.kyselynTulos.map(opettaja => ({
                        ...opettaja,
                        aloitusvuosi: paivaysSuomenAikaan(opettaja.aloitusvuosi)
                    }))
                    resolve(kaikkiOpettajat);
                }
                else {
                    reject(ohjelmavirhe());
                }
            }
            catch (virhe) {
                reject(ohjelmavirhe(virhe));
            }
        });
    }

    hae(opettajaID) {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.varasto.suoritaKysely(haeOpettajaSql, [+opettajaID]);
                if (tulos.tulosjoukko) {
                    if (tulos.kyselynTulos.length > 0) {
                        const hakutulos = tulos.kyselynTulos[0]
                        console.log('HAE OPETTAJA TULOS', hakutulos)
                        const aloitusvuosi = paivaysSuomenAikaan(hakutulos.aloitusvuosi)

                        resolve({
                            ...hakutulos,
                            aloitusvuosi
                        });
                    }
                    else {
                        // resolve({ viesti: `Numerolla ${kirjaID} ei löytynyt opettajaa` });
                        reject(virhe(`Numerolla ${opettajaID} ei löytynyt opettajaa`));
                    }
                }
                else {
                    reject(ohjelmavirhe());
                }
            }
            catch (virhe) {
                reject(ohjelmavirhe(virhe));
            }
        });
    }

    lisaa(opettaja) {
        return new Promise(async (resolve, reject) => {
            try {
                const hakutulos = await this.varasto.suoritaKysely(haeOpettajaSql, [+opettaja.opettajaID]);
                if (hakutulos.kyselynTulos.length === 0) {
                    const tulos = await this.varasto.suoritaKysely(lisaaOpettajaSql, opettajantiedot(opettaja));
                    if (tulos.kyselynTulos.muutetutRivitLkm === 1) {
                        resolve({ viesti: `Opettaja numerolla ${opettaja.opettajaID} lisättiin.` });
                    }
                    else {
                        reject(virhe('Opettajaa ei lisätty'));
                    }
                }
                else {
                    reject(virhe(`OpettajaId ${opettaja.opettajaID} oli jo varastossa`));
                }
            }
            catch (virhe) {
                reject(ohjelmavirhe(virhe));
            }
        });
    }

    muokkaa(opettajaID, opettaja) {
        return new Promise(async (resolve, reject) => {
            try {
                const hakutulos = await this.varasto.suoritaKysely(haeOpettajaSql, [opettajaID]);
                if (hakutulos.kyselynTulos.length === 1) {
                    const tulos = await this.varasto.suoritaKysely(paivitaOpettajaSql, paivitysTiedot(opettaja));
                    console.log('TULOS', tulos)
                    if (tulos.kyselynTulos.muutetutRivitLkm === 1) {
                        resolve({ viesti: `Opettaja numerolla ${opettaja.opettajaID} päivitettiin.` });
                    }
                    else {
                        reject(virhe('Opettajaa ei päivitetty'));
                    }
                }
                else {
                    reject(virhe(`Opettajaa ${opettaja.opettajaID} ei ole varastossa`));
                }
            }
            catch (virhe) {
                reject(ohjelmavirhe(virhe));
            }
        });
    }

    poista(opettajaID) {
        return new Promise(async (resolve, reject) => {
            try {
                const hakutulos = await this.varasto.suoritaKysely(haeOpettajaSql, [opettajaID]);
                if (hakutulos.kyselynTulos.length > 0) {
                    const tulos = await this.varasto.suoritaKysely(poistaOpettajaSql, [opettajaID]);
                    console.log('TULOS', tulos)
                    if (tulos.kyselynTulos.muutetutRivitLkm === 1) {
                        resolve({ viesti: `Opettaja numerolla ${opettajaID} poistettiin.` });
                    }
                    else {
                        reject(virhe('Opettajaa ei poistettu'));
                    }
                }
                else {
                    reject(virhe(`Opettajaa ${opettajaID} ei ole varastossa`));
                }
            }
            catch (virhe) {
                reject(ohjelmavirhe(virhe));
            }
        });
    }
}
