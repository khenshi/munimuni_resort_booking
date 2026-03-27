import resort_bg from '../assets/resort_sectionbg.jpg'

{/* unsa mn design ani */}

export default function Resort() {

  return (
    <section className="resortSection" id="resort">
        <div className="sectionFirst">
            <img src={resort_bg} className="resortImg"/>
            <div className="textContainer">   
                <h2 className="">Experience Inner Peace</h2>
                <p>World class beach, with stunning corals and shit.</p>
                <p><strong>improve typography</strong></p>
            </div>
        </div>

    </section>
  )
}