'use strict'
/*
 * This is a proof of concept to handle POQ TMF679 business rules
 * For this to work, we need to always receive the same "requests" whit this structure : 
 * {
    "placeId": "12345",
    "nearestObject": "Fibre Cabinet FPP: ", 
    "distance": "0", 
    "fiberIndicator": "no",
    "telusTerritory": "yes", 
    "nonWinterCost": "30000",
    "nearestPartner": "Rogers", 
    "distanceNearestPartner": "102", 
    "productGroup": "CES", 
    "priceBand": "A", 
    "maxBandwidth": "100G"
  }
 */

require('colors')
const { Engine } = require('json-rules-engine')

async function start () {
  /**
   * Setup a new engine
   */
  const engine = new Engine()
  /**
   * Rule for identifying product group that are CES
   */
  const rule1Red = {
    name: "Rule #1 - RED",
    conditions: {
      all: [
        {
          fact: 'productGroup',
          operator: 'notEqual',
          value: "CES"
        }
      ]
    },
    event: {
      type: 'message',
      params: {
        result: 'RED', 
        reason: 'Rule #1 - Product Group NOT equals CES'
      }
    },
    priority: 100, // IMPORTANT!  Set a higher priority for the drinkRule, so it runs first
  }
  engine.addRule(rule1Red)

   /**
   * Rule for that a Price Band is present
   */
   const rule2Red = {
    name: "Rule #2 - RED",
    conditions: {
      all: [
        {
          fact: 'productGroup',
          operator: 'equal',
          value: "CES"
        },
        {
          fact: 'priceBand',
          operator: 'equal',
          value: ""
       }]
    },
    event: {
      type: 'message',
      params: {
        result: 'RED', 
        reason: 'Rule #2 - ProductGroup = CES and Price Band NOT present'
      }
    },
    priority: 99, // IMPORTANT!  Set a lower priority, so it runs later
  }
  engine.addRule(rule2Red)

   /**
   * Rule for that a Price Band is present
   */
    const rule3Red = {
      name: "Rule #3 - RED",
      conditions: {
        all: [
          {
            fact: 'productGroup',
            operator: 'equal',
            value: "CES"
          },
          {
            fact: 'priceBand',
            operator: 'notEqual',
            value: ""
          },
          {
            fact: 'fiberIndicator',
            operator: 'equal',
            value: "no"
          },
          {
            fact: 'nearestObject',
            operator: 'equal',
            value: ""
          },
          {
            fact: 'nearestPartner',
            operator: 'equal',
            value: ""
          }
      
        ]
      },
      event: {
        type: 'message',
        params: {
          result: 'RED', 
          reason: 'Rule #3 - ProductGroup = CES, Price Band present, fibreIndicator = NO, nearestObject is Null and nearestPartner is Null'
        }
      },
      priority: 98, // IMPORTANT!  Set a lower priority, so it runs later
    }
    engine.addRule(rule3Red)

   /**
   * Rule #4
   */
    const rule4Red = {
      name: "Rule #4 - RED",
      conditions: {
        all: [
          {
            fact: 'productGroup',
            operator: 'equal',
            value: "CES"
          },
          {
            fact: 'priceBand',
            operator: 'notEqual',
            value: ""
          },
          {
            fact: 'fiberIndicator',
            operator: 'equal',
            value: "no"
          },
          {
            fact: 'nearestObject',
            operator: 'equal',
            value: ""
          },
          {
            fact: 'nearestPartner',
            operator: 'notEqual',
            value: ""
          },
          {
            fact: 'distanceNearestPartner',
            operator: 'greaterThanInclusive',
            value: "500"
          }
      
        ]
      },
      event: {
        type: 'message',
        params: {
          result: 'RED', 
          reason: 'Rule #4 - ProductGroup = CES, Price Band present, fibreIndicator = NO, nearestObject is Null and nearestPartner Present and distanceNearestPartnet >= 500m'
        }
      },
      priority: 97, // IMPORTANT!  Set a lower priority, so it runs later
    }
    engine.addRule(rule4Red)
  /**
   * Rule #5
   */
   const rule5Red = {
    name: "Rule #5 - YELLOW",
    conditions: {
      all: [
        {
          fact: 'productGroup',
          operator: 'equal',
          value: "CES"
        },
        {
          fact: 'priceBand',
          operator: 'notEqual',
          value: ""
        },
        {
          fact: 'fiberIndicator',
          operator: 'equal',
          value: "no"
        },
        {
          fact: 'nearestObject',
          operator: 'equal',
          value: ""
        },
        {
          fact: 'nearestPartner',
          operator: 'notEqual',
          value: ""
        },
        {
          fact: 'distanceNearestPartner',
          operator: 'lessThanInclusive',
          value: "500"
        }
    
      ]
    },
    event: {
      type: 'message',
      params: {
        result: 'YELLOW', 
        reason: 'Telus Fibre Build required - 160 calendarDays'
      }
    },
    priority: 96, // IMPORTANT!  Set a lower priority, so it runs later
  }
  engine.addRule(rule5Red)
 

  let factRule1 = {
    "placeId": "12345",
    "nearestObject": "Fibre Cabinet FPP: ", 
    "distance": "0", 
    "fiberIndicator": "no",
    "telusTerritory": "yes", 
    "nonWinterCost": "30000",
    "nearestPartner": "Rogers", 
    "distanceNearestPartner": "102", 
    "productGroup": "", 
    "priceBand": "A", 
    "maxBandwidth": "100G"
  }
  let factRule2 = {
    "placeId": "12345",
    "nearestObject": "Fibre Cabinet FPP: ", 
    "distance": "0", 
    "fiberIndicator": "no",
    "telusTerritory": "yes", 
    "nonWinterCost": "30000",
    "nearestPartner": "Rogers", 
    "distanceNearestPartner": "102", 
    "productGroup": "CES", 
    "priceBand": "", 
    "maxBandwidth": "100G"
  }
  let factRule3 = {
    "placeId": "12345",
    "nearestObject": "", 
    "distance": "0", 
    "fiberIndicator": "no",
    "telusTerritory": "yes", 
    "nonWinterCost": "30000",
    "nearestPartner": "", 
    "distanceNearestPartner": "102", 
    "productGroup": "CES", 
    "priceBand": "A", 
    "maxBandwidth": "100G"
  }
  let factRule4 = {
    "placeId": "12345",
    "nearestObject": "", 
    "distance": "0", 
    "fiberIndicator": "no",
    "telusTerritory": "yes", 
    "nonWinterCost": "30000",
    "nearestPartner": "Rogers", 
    "distanceNearestPartner": "502", 
    "productGroup": "CES", 
    "priceBand": "A", 
    "maxBandwidth": "100G"
  }
  let factRule5 = {
    "placeId": "12345",
    "nearestObject": "", 
    "distance": "0", 
    "fiberIndicator": "no",
    "telusTerritory": "yes", 
    "nonWinterCost": "30000",
    "nearestPartner": "Rogers", 
    "distanceNearestPartner": "402", 
    "productGroup": "CES", 
    "priceBand": "A", 
    "maxBandwidth": "100G"
  }

  engine.on('failure', (event, almanac, ruleResult) => {
    almanac.factValue('placeId').then(placeId => {
      console.log(`LPDS ID : ${placeId.bold} does not qualifies for ${ruleResult.name} - ` /*, ruleResult*/)
    })
  })

  engine.on('success', (event, almanac, ruleResult) => {
    almanac.factValue('placeId').then(placeId => {
      console.log(`LPDS ID : ${placeId.bold} qualifies for ${ruleResult.name} - ` /*, ruleResult*/)
    })
  })

  // let results = await engine.run(fact)

  engine
  .run(factRule5)
  .then(({ events }) => {
    events.map(event => { 
       //console.log(event);
      if (event.params.result == 'RED') {
        console.log(event.params.result.red, event.params.reason.red)
      }else if (event.params.result == 'YELLOW') {
        console.log(event.params.result.yellow, event.params.reason.yellow)
      }else if (event.params.result == 'GREEN') {
        console.log(event.params.result.green, event.params.reason.green)
      }else {
        console.log({error: 'No rules matching'})
      }    
    }) // event
  }) // then
  .catch(({ err }) => {
    let errorMessage = 'ERROR : No rules matching - Stacktrace: ' +err ;
    console.log(errorMessage.orange);
  })
}



start()

/*
 * OUTPUT:
 *
 * loading account information for "washington"
 * washington(microsoft) DID meet conditions for the drinks-screwdrivers rule.
 * washington(microsoft) DID meet conditions for the invite-to-screwdriver-social rule.
 * washington IS a screwdriver aficionado
 * jefferson did NOT meet conditions for the drinks-screwdrivers rule.
 * jefferson did NOT meet conditions for the invite-to-screwdriver-social rule.
 * jefferson IS NOT a screwdriver aficionado
 */
