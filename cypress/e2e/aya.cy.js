describe("test for aya", () => {

    it('first test for mocking', () => {
        cy.intercept('GET', '**AyaHealthcareWeb/job/search**', { fixures: 'moked_response.json' }).as('jobsItems')
        cy.intercept('GET', '**AyaHealthcareWeb/job/search**').as('jobsItems2')
        cy.visit('/travel-nursing/travel-nursing-jobs')

        cy.location('pathname').then((loc => {
            cy.log('the URL is:', loc)
        }))
        cy.wait('@jobsItems', { timeout: 60000 }).then((response) => {
            const listOfJobs = response.response.body.count
            cy.log("count of items is:", listOfJobs)
           
        })
    })
})