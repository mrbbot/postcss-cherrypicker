/* eslint-disable */
const thing = <div>
    <h1 id="title" onClick={alert("Hi")}>Title<span className="hi"></span></h1>
    <h2 className="subtitle light">Hi</h2>
</div>

const otherThing = <section>
    {
        [0, 1, 2].map(v => <p className="number">{v}</p>)
    }
    <p>I'm a section</p>
</section>
