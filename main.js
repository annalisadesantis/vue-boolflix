var app = new Vue({
    el: "#root",
    data: {
        // Input di ricerca
        filterTitle: "",
        // Array film + array serie tv
        allresults: [],
        // Array flag disponibili
        availableFlags: ['it', 'en', 'es', 'fr', 'de', 'pt', 'zh', 'ru', 'ja'],
        // Chiave per salvare la ricerca
        testo_titolo: "",
        // Ricerca titolo
        ricerca_in_corso: false,
        // Chiamata get base
        getbase: "https://api.themoviedb.org/3/search/",
        // Url imaggine base
        url_img: "https://image.tmdb.org/t/p/w342",
        // Api key
        api_key: "ff1d795e3b22f2a6056bd3125c445371",
        // Array generi
        generi: []

    },
    methods:{
        // Funzione per calcolare il voto in 5/5
        getFasStar(average) {
            // Divido il valore voto
            let valore = average / 2;
            // Arrotondo il valore per eccesso
            let arrotondato = Math.round(valore);
            return arrotondato;
        },
        genderlist(){
            axios.get('https://api.themoviedb.org/3/genre/movie/list', {
                params:{
                    api_key: this.api_key,
                }
            })
            .then(results => {
                // Assegno al risultato dell'api all'array generi
                this.generi = this.generi.concat(results.data.genres);
            });

            axios.get('https://api.themoviedb.org/3/genre/tv/list', {
                params:{
                    api_key: this.api_key,
                }
            })
            .then(results => {
                // Assegno al risultato dell'api all'array generi
                this.generi = this.generi.concat(results.data.genres);
                console.log(this.generi);
            });
        },
        getProductGenres(elemento) {

            // Creo un array per salvare i generi dell'elemento
            let lista_generi_elemento = [];

            // Creo una varibile che corrisponde agli ID del singolo elemento
            let codici_genere_elemento = elemento.genre_ids;

            // Ciclo l'array genery che avevo già creato
            this.generi.forEach((lista_generi) => {

                // Ciclo gli ID del singolo elemento
                codici_genere_elemento.forEach((codice_genere_elemento) => {

                    // Se gli id di lista generi concide con gli id dell'elemento
                    if(lista_generi.id === codice_genere_elemento) {

                        // Ma anche se l'array dell'elemento non include il nome della lista generi
                        if(!lista_generi_elemento.includes(lista_generi.name)){
                            // Allora faccio push nell'array dell'elemento
                            lista_generi_elemento.push(lista_generi.name);
                        }
                    }
                });
            });

            // Restituisco l'array dell'elemento già popolato dei nomi dei generi che corrispondono ai suoi id 
            return lista_generi_elemento.join(", ");
        },
        getPoster(item){

            var newUrl = "";

            if (item.poster_path != null) {
                newUrl = this.url_img + item.poster_path;
            // Quando hanno null inserisco un'immagine salvata
            }else{
                newUrl = 'img-no-disp.png';
            }
            return newUrl;
        },
        search(){

            // Eseguo la ricerca solo se il campo è stato compilato
            if(this.filterTitle.trim() != ''){

                // Attivo la ricerca in corso su true
                this.ricerca_in_corso = true;

                // Mi assicuro che l'array globale sia vuotoi svuotati
                this.allresults = [];

                // Salvo il dato della ricerca in un'altra chiave
                this.testo_titolo = this.filterTitle;

                // Richiamo la funzione per i film
                this.eseguiRicerca('movie', 'movie');
                // Richiamo la funzione per le serie
                this.eseguiRicerca('tv', 'tv');

                // Ripulisco l'input
                this.filterTitle = "";

            }
        },
        eseguiRicerca(elemento, elementoPerCast) {

            // Chiamata get per film/serie
            axios.get(this.getbase + elemento, {
                params:{
                    api_key: this.api_key,
                    query: this.filterTitle
                }
            })
            .then((results) => {

                this.ricerca_in_corso = false;

                // Creo una varibiale di appoggio per sviluppare i risultati
                var lista = results.data.results;

                // Creo un ciclo aggiungere gli attori
                lista.forEach((item) => {

                    // Chiamata get per attori
                    axios.get('https://api.themoviedb.org/3/' + elementoPerCast + '/' + item.id + '/credits', {
                        params:{
                            api_key: this.api_key,
                        }
                    })
                    .then((results) => {
                        Vue.set(item, 'cast', results.data.cast);
                    })
                });

                // Concateno il risultato ottenuto all'array globale
                this.allresults = this.allresults.concat(lista);
                console.log(this.allresults);
            });

        }
    },
    mounted(){

        axios.get('https://api.themoviedb.org/3/movie/top_rated', {
            params:{
                api_key: this.api_key,
            }
        })
        .then((results) => {
            // Assegno al risultato dell'api all'array movies
            this.allresults = results.data.results;

            this.allresults.forEach((item) => {

                axios.get('https://api.themoviedb.org/3/movie/' + item.id + '/credits', {
                    params:{
                        api_key: this.api_key,
                    }
                })
                .then((results) => {
                    Vue.set(item, 'cast', results.data.cast);
                })
            });

        });

        this.genderlist();
        console.log(this.generi);

    }

});
