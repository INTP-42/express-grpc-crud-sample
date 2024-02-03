const {customerService} = require('../grpc/service')

module.exports = (app) => {
  app.get('/liveness', (req, res) => {
    try {
      res.status(200).send("working")
    } catch (error) {
      console.log(`liveness check failed: ${error.stack || error}`)
      res.status(400).json(error)
    }
  })

  app.get("/", (req, res) => {
    customerService.getAll(null, (err, data) => {
        if (!err) {
            res.render("customers", {
                results: data.customers
            });
        }
    });
  });

  app.post("/save", (req, res) => {
      let newCustomer = {
          name: req.body.name,
          age: req.body.age,
          address: req.body.address
      };

      customerService.insert(newCustomer, (err, data) => {
          if (err) throw err;

          console.log("Customer created successfully", data);
          res.redirect("/");
      });
  });

  app.post("/update", (req, res) => {
      const updateCustomer = {
          id: req.body.id,
          name: req.body.name,
          age: req.body.age,
          address: req.body.address
      };

      customerService.update(updateCustomer, (err, data) => {
          if (err) throw err;

          console.log("Customer updated successfully", data);
          res.redirect("/");
      });
  });

  app.post("/remove", (req, res) => {
      customerService.remove({ id: req.body.customer_id }, (err, _) => {
          if (err) throw err;

          console.log("Customer removed successfully");
          res.redirect("/");
      });
  });
}
