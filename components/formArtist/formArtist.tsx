const FormArtist = () => {
  return (
    <div>
      <h1>Artist submission form</h1>
      <form>
        <div className="form-group">
          <label>Artist Name</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label>Artist Email</label>
          <input type="email" className="form-control" />
        </div>
        <div className="form-group">
          <label>Artist Phone</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label>Music genre</label>
          <select className="form-control">
            <option>Rock</option>
            <option>Pop</option>
            <option>Electro</option>
            <option>Classical</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Do you own 100% of the streaming revenue rights</label>
          <select className="form-control">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default FormArtist;
