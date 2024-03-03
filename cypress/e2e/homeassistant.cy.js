describe('magic home party', () => {
  beforeEach(() => {
    cy
      .visit('http://localhost:8123')
      .getCookies().should('be.empty')
      .then(a =>{
        console.log("url is", cy.url())
        return a
      })
      .reload()
      .when('ha-auth-flow',
        () => {
          console.log("not onboarding")
          return cy.get('Home')
            .get('input[name=username]').type("tester", {force: true})
            .get('input[name=password]').type("password", {force: true})
            .root()
            .contains('Login').click()
        },
        () => cy
          .contains('Create my smart home').click()
          .get('input[name=name]').type("Tester", {force: true})
          .get('input[name=username]').type("tester", {force: true})
          .get('input[name=password]').type("password", {force: true})
          .get('input[name=password_confirm]').type("password", {force: true})
          .root()
          .contains('Create Account').click()
          .get('input').first().type("Londong", {force: true})
        )
      .then(onboarding => {
        console.log("Got to here then", onboarding)
      })
      // .then(_ =>
      //   cy
      //     .contains('Create my smart home').click()
      //     .get('input[name=name]').type("Tester", {force: true})
      //     .get('input[name=username]').type("tester", {force: true})
      //     .get('input[name=password]').type("password", {force: true})
      //     .get('input[name=password_confirm]').type("password", {force: true})
      //     .root()
      //     .contains('Create Account').click()
      //   ).then(_ =>
      //     cy.get('input').first().type("London", {force: true})
      //   )
  })

  describe('card', () => {
    it('works', () => {

    })
  })
})
