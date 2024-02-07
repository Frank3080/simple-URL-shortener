import React from "react";
import { nanoid } from "nanoid";
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUri } from "valid-url";
import { OverlayTrigger } from "react-bootstrap";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      longURL: "",
      preferedAlias: "",
      generatedURL: "",
      loading: false,
      errors: [],
      errorMessage: {},
      toolTipMessage: "Copy to clipboard",
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
      generatedURL: "",
    });

    var isFormValid = await this.validateInput;
    if (!isFormValid) {
      return;
    }

    var generatedKey = nanoid(6);
    var generatedURL = "linksnipper.com/" + generatedKey;

    if (this.state.preferedAlias !== "") {
      generatedKey = this.state.preferedAlias;
      generatedURL = "linksnipper.com/" + this.state.preferedAlias;
    }

    const db = getDatabase();
    get(ref(db, "/" + generatedKey), {
      generatedKey: generatedKey,
      longURL: this.state.longURL,
      preferedAlias: this.state.preferedAlias,
      generatedURL: generatedURL,
    })
      .then((result) => {
        this.setState({
          generatedURL: generatedURL,
          loading: false,
        });
      })
      .catch((error) => {
        //error
      });
  };

  hasError = (key) => {
    return this.state.errors.indexOf(key) !== -1;
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  validateInput = async () => {
    var errors = [];
    var errorMessages = this.state.errorMessage;

    //Validate long URL
    if (this.state.longURL.length === 0) {
      errors.push("longURL");
      errorMessages["longURL"] = "Please enter your URL";
    }

    if (!isWebUri(this.state.longURL)) {
      errors.push("longURL");
      errorMessages["longURL"] = "Please enter a valid URL format.";
    }

    // Prefered Alias
    if (this.state.preferedAlias !== "") {
      if (this.state.preferedAlias.length > 7) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "Alias cannot have more than 7 characters";
      } else if (this.state.preferedAlias.indexOf(" ") >= 0) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] = "URLs cannot have spaces";
      }

      var keyExist = await this.checkKeyExists();

      if (keyExist.exists()) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "The alias you have entered already exists, please enter another one.";
      }
    }

    this.setState({
      errors: errors,
      errorMessages: errorMessages,
      loading: false,
    });

    if (errors.length > 0) {
      return false;
    }

    return true;
  };

  checkKeyExists = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${this.state.preferedAlias}`)).catch((err) => {
      return false;
    });
  };

  copyToClipboard = () => {
    navigator.clipboard.writeText(this.state.generatedURL);
    this.setState({
      toolTipMessage: "Copied!",
    });
  };

  render() {
    return (
      <div className="container">
        <form>
          <h3>Shorten your URL!</h3>
          <div className="form-group">
            <label>Enter your URL</label>
            <input
              placeholder="https://www..."
              id="longURL"
              onChange={this.handleChange}
              value={this.state.longURL}
              type="url"
              required
              className={
                this.hasError("longURL")
                  ? "form-control is-invalid"
                  : "form-control"
              }
            />
          </div>
          <div
            className={
              this.hasError("longURL") ? "text-danger" : "visually-hidden"
            }
          >
            {this.state.errorMessage.longURL}
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={this.onSubmit}
          >
            {this.state.loading ? (
              <div>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </div>
            ) : (
              <div>
                <span
                  className="visually-hidden spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Make it shorter!</span>
              </div>
            )}
          </button>
        </form>
      </div>
    );
  }
}

export default Form;
