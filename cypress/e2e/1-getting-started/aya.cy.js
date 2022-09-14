describe("test for aya", () => {

    it('first test for mocking', () => {
        cy.intercept('GET', '**AyaHealthcareWeb/job/search**', { fixures: 'moked_response.json' }).as('jobsItems')
        cy.intercept('GET', '**AyaHealthcareWeb/job/search**').as('jobsItems2')
        cy.visit('/travel-nursing/travel-nursing-jobs')

        cy.wait('@jobsItems', { timeout: 60000 }).then((response) => {
            const listOfJobs = response.response.body.count
            cy.log("count of items is:", listOfJobs)
           
        })
        cy.reload()
        cy.wait('@jobsItems2', { timeout: 60000 }).then((response) => {
            const listOfJobs = response.response.body.count
            cy.log("count of items is:", listOfJobs)
            
        })
    })
})