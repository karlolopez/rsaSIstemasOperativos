function isPrime(candidate) {
    if (typeof candidate != 'object') 
        candidate = new SuperInteger(candidate);
    
    if (candidate.eq(2) || candidate.eq(3))
        return true;
    
    if (candidate.mod(2).eq(0))
        return false;
    
    // Genera primos pequeños (3 a 7919)
    // Podríamos usar el crive aquí, pero no hay necesidad,
    // porque el intervalo es demasiado corto ...
    var smallPrimes = [];
    for (var i = 3; i <= 7919; i++) {
        var isPrime = true;
        for (var j = 0; j <= Math.sqrt(i); j++)
            if (i % j == 0) isPrime = false;
        if (isPrime == true) {
            smallPrimes.push(new SuperInteger(i));
            //
            console.log("Small prime: " + i);
            //
        }
    }
        
    // Probar candidato contra primos pequeños
    for (var i = 0; i < smallPrimes.length; i++)
        if (candidate.mod(smallPrimes[i]).eq(zero))
            continue;
            
    // Genera un número aleatorio más pequeño que el candidato
    var random = new SuperInteger().random(3, candidate.minus(1));

    // Prueba de primalidad de Fermat
    if(random.powMod(candidate.minus(1), candidate).eq(1) == false) 
        return false;

    var miller_test = true;
            
    // Prueba de primaria de Miller-Rabin -> 10 veces
    for (var it = 0; it < 10; it++) {
        // Genera otro número aleatorio más pequeño que el candidato
        random = new SuperInteger().random(3, candidate.minus(1));

        //Calcular ryd como (candidata-1) = 2 ^ r * d
        var d = new SuperInteger(candidate.minus(1));
        var a = new SuperInteger(1);
        while (d.mod(2).eq(0)) {
            d = d.div(2);
            a = a.add(1);   
        }
    
        // Calcular x y pruebe si es uno o candidato-1
        var x = random.powMod(d,candidate);
        if (x.eq(1) || x.eq(candidate.minus(1)))
            return true;

        for (var i = 0; i < parseInt(a.minus(1).toString()); i++) {
            x = x.pow(2).mod(candidate);
            if (x.eq(1)) {
                miller_test = false;
                return true;
            }
            if (x.eq(candidate.minus(1)))
                return true;
        }
    }    
    return false;
};

function generatePrime(bits) {
    var maxnumber = new SuperInteger(2).pow(bits).minus(1);
    var candidate = new SuperInteger(2);
    var tested = {};
    do {
        tested[candidate] = 1;
        candidate = candidate.random(3, maxnumber);
    } while (candidate in tested || isPrime(candidate) == false);
    return candidate;
};